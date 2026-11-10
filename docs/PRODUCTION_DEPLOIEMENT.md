# Mise en production et déploiement

Ce guide décrit l'état du dépôt au moment de sa rédaction. Il ne modifie ni le code, ni les images Docker, ni le fichier Compose existant.

## Périmètre déployé

Le dépôt contient quatre processus :

| Composant | Rôle | Port interne observé |
| --- | --- | --- |
| PostgreSQL 17 | stockage transactionnel | 5432 |
| `backend` NestJS | API REST, JWT, Prisma et Swagger | 3000 |
| `frontend` React/Vite | portail ERP des enseignants, RH et finance | 5173 en développement |
| `admin` React/Vite | console d'administration | 5175 en développement |

Le navigateur doit joindre l'API sur une URL publique. Une adresse Docker telle que `http://backend:3000` ne fonctionne pas dans un navigateur extérieur au réseau Docker.

## État de préparation constaté

Le `docker-compose.yml` racine est conçu pour le développement. Il monte les sources, lance `nest start --watch` et les deux serveurs Vite, puis publie PostgreSQL sur l'hôte. Ne le déployez pas tel quel sur un serveur de production.

| Sujet | État constaté | Conséquence de production |
| --- | --- | --- |
| API | l'image sait construire `dist` et lancer `start:prod` | exploitable après une image dédiée et un lancement de migrations |
| Interfaces web | les Dockerfiles exécutent Vite en mode développement | construire des fichiers statiques et les servir par Nginx, Caddy ou un CDN |
| Administration | URL API codée à `http://localhost:3001` | blocage : l'interface ne peut pas joindre l'API depuis le poste d'un utilisateur sans changement de code |
| CORS | l'API accepte `origin: '*'` | restreindre aux domaines publics avant ouverture à Internet |
| JWT | un secret de secours est présent dans la stratégie JWT | fournir impérativement `JWT_SECRET`, long et unique |
| Swagger | `/api` est activé sans protection propre | restreindre par réseau, authentification de proxy ou désactiver pour l'exposition publique |
| Base | une migration Prisma versionnée existe | appliquer avec `prisma migrate deploy`, jamais `migrate dev` |
| Sauvegardes | aucune automatisation dans le dépôt | mettre en place des sauvegardes et une restauration testée |

Le présent guide s'arrête avant les changements de code requis par les trois blocages applicatifs : URL de l'interface admin, CORS et exposition de Swagger.

## Variables d'environnement

Copiez les modèles versionnés, puis protégez les fichiers réels. Le `.gitignore` exclut les fichiers `.env`.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
chmod 600 backend/.env frontend/.env admin/.env
```

Ne validez jamais les fichiers `.env`, les chaînes de connexion contenant un mot de passe ou les secrets JWT. Stockez-les dans le gestionnaire de secrets de votre hébergeur, puis injectez-les au démarrage.

| Variable | Consommée par | Valeur attendue |
| --- | --- | --- |
| `DATABASE_URL` | backend et Prisma | URL PostgreSQL complète, avec utilisateur applicatif à privilèges limités |
| `SHADOW_DATABASE_URL` | Prisma CLI pour les commandes de développement | base distincte ; ne pas définir pour le déploiement des migrations |
| `JWT_SECRET` | stratégie et signature JWT | secret aléatoire, au moins 32 octets |
| `PORT` | backend | `3000` dans le conteneur |
| `VITE_API_URL` | frontend à la compilation | URL HTTPS publique de l'API, sans slash final |

Les variables `VITE_*` sont intégrées au JavaScript lors de `npm run build`. Elles ne constituent pas un mécanisme de secret et toute valeur devient visible dans le navigateur.

Générez le secret JWT, par exemple :

```bash
openssl rand -base64 48
```

## Architecture cible

Utilisez trois noms DNS, par exemple `erp.example.com`, `admin.example.com` et `api.example.com`. Terminez TLS au niveau d'un proxy inverse. Celui-ci sert les fichiers statiques des deux interfaces et transmet les requêtes API vers le backend sur un réseau privé.

```text
Navigateurs
    │ HTTPS
    ▼
Proxy inverse / CDN
 ├── erp.example.com       → fichiers statiques frontend
 ├── admin.example.com     → fichiers statiques admin
 └── api.example.com       → backend:3000 → PostgreSQL:5432
                                      réseau privé uniquement
```

N'exposez pas le port PostgreSQL. N'exposez pas Prisma Studio. N'exposez le port applicatif du backend que si le proxy inverse ne peut pas partager son réseau Docker.

## Procédure de déploiement

### 1. Préparer le serveur

1. Créez un hôte Linux maintenu, un DNS public et des certificats TLS renouvelés automatiquement.
2. Installez Docker Engine et le plugin Compose, ou utilisez les services managés équivalents.
3. Créez un réseau interne entre l'API et PostgreSQL. Placez le proxy dans ce réseau et dans le réseau public.
4. Créez un volume persistant chiffré pour PostgreSQL ou une instance PostgreSQL managée. Définissez une rétention de sauvegardes.
5. Créez un utilisateur PostgreSQL applicatif, différent du superutilisateur. Accordez-lui uniquement les droits nécessaires sur la base ERP.

### 2. Construire des artefacts immuables

Depuis un clone propre, verrouillé sur le commit à publier :

```bash
cd backend
npm ci
npx prisma generate
npm run build

cd ../frontend
npm ci
VITE_API_URL=https://api.example.com npm run build

cd ../admin
npm ci
VITE_API_URL=https://api.example.com npm run build
```

Les deux dernières commandes créent un répertoire `dist/`. Servez son contenu avec une règle de repli vers `index.html` afin que les routes React fonctionnent après un rechargement direct.

Le build de l'administration accepte la variable dans la commande, mais le code actuel ne la lit pas. N'annoncez pas ce service en production avant d'avoir corrigé ce point dans une évolution distincte.

Pour l'API, fabriquez une image de production qui exécute seulement `node dist/main`, embarque les dépendances nécessaires à l'exécution et n'embarque aucun fichier `.env`. Étiquetez l'image avec le SHA Git et conservez ce SHA dans le journal de déploiement.

### 3. Appliquer les migrations

Sauvegardez la base avant chaque migration. Lancez ensuite cette commande une seule fois par version, depuis une image backend contenant le schéma et `DATABASE_URL` :

```bash
npx prisma migrate deploy
```

`migrate deploy` applique les migrations versionnées qui manquent, sans créer ni réinitialiser de base. Ne lancez jamais `prisma migrate dev`, `prisma db push`, ni la commande de réinitialisation documentée dans le README sur une base de production.

### 4. Démarrer et vérifier

1. Démarrez PostgreSQL, puis l'API, puis le proxy et les interfaces statiques.
2. Vérifiez que l'API répond avec un code HTTP attendu sur une route non sensible. Le contrôleur racine existe, mais le dépôt ne fournit pas de sonde `/health` dédiée.
3. Ouvrez la page de connexion du portail et réalisez un parcours avec un compte de test : connexion, consultation puis déconnexion.
4. Consultez les journaux de l'API et du proxy. Vérifiez l'absence d'erreur Prisma, de refus CORS et de secret affiché.
5. Vérifiez les certificats, les en-têtes HTTPS, l'absence de port PostgreSQL accessible et le contrôle d'accès à `/api`.

## Exploitation courante

### Sauvegardes et restauration

Effectuez au moins une sauvegarde logique chiffrée quotidienne et conservez des copies hors du serveur de production. Pour PostgreSQL conteneurisé :

```bash
pg_dump --format=custom --no-owner --dbname="$DATABASE_URL" > erp_honey_YYYY-MM-DD.dump
```

Testez chaque trimestre une restauration sur une base isolée. Une sauvegarde sans restauration contrôlée ne protège pas le service.

### Journalisation et supervision

Centralisez les logs du proxy, de l'API et de PostgreSQL. Alertez sur l'indisponibilité de l'API, les erreurs 5xx, l'espace disque du volume PostgreSQL, les échecs de sauvegarde et l'expiration des certificats. Ne journalisez ni `Authorization`, ni mots de passe, ni jetons JWT.

### Mise à jour et retour arrière

1. Sauvegardez la base.
2. Construisez et testez les artefacts du nouveau SHA hors production.
3. Exécutez les migrations compatibles avec la version actuellement en ligne.
4. Déployez l'image API et les fichiers statiques.
5. Surveillez le parcours de connexion et les erreurs pendant la fenêtre définie.
6. En cas d'incident, redéployez l'image et les fichiers statiques précédents. N'annulez une migration de données qu'avec une procédure testée et une sauvegarde restaurable.

## Liste de contrôle avant ouverture publique

- [ ] `JWT_SECRET` est unique, aléatoire et fourni par un gestionnaire de secrets.
- [ ] `DATABASE_URL` utilise TLS si la base est distante et un compte non superutilisateur.
- [ ] PostgreSQL, Prisma Studio et les serveurs Vite ne sont pas exposés publiquement.
- [ ] Le proxy force HTTPS et le backend ne reçoit que le trafic du proxy.
- [ ] Les origines CORS autorisées, Swagger et l'URL de l'administration ont été corrigés dans une livraison applicative dédiée.
- [ ] Les migrations ont été appliquées avec `prisma migrate deploy` et une sauvegarde récente existe.
- [ ] Une restauration a été testée et les alertes de disponibilité, capacité et sauvegarde sont actives.
