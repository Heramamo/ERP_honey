# Déploiement sans Docker

Ce guide installe ERP Honey sur un serveur Linux avec Node.js, PostgreSQL, Nginx et systemd. Il décrit une cible de production sans conteneur et ne modifie aucun fichier applicatif.

## Cible retenue

| Élément | Emplacement proposé | Exposition réseau |
| --- | --- | --- |
| API NestJS | `/srv/erp/backend` | `127.0.0.1:3000` seulement |
| Portail React | `/srv/www/erp` | HTTPS via Nginx |
| Administration React | `/srv/www/admin` | HTTPS via Nginx, après correction de l'URL API |
| PostgreSQL | service local ou instance managée | privé |
| Secrets API | `/etc/erp/backend.env` | lecture par le compte de service uniquement |

Utilisez une distribution Linux maintenue, Node.js 22, PostgreSQL 17, Nginx et systemd. Faites exécuter l'API par un compte système dédié, par exemple `erp`, sans accès interactif.

## 1. Préparer l'hôte

L'administrateur installe les paquets système et crée les répertoires :

```bash
sudo install -d -o erp -g erp /srv/erp/backend
sudo install -d -o www-data -g www-data /srv/www/erp /srv/www/admin
sudo install -d -o root -g erp -m 750 /etc/erp
```

Le serveur doit recevoir les mises à jour de sécurité, synchroniser son horloge et disposer d'un pare-feu. Autorisez seulement SSH administré et HTTPS public. PostgreSQL et le port `3000` restent privés.

Créez une base `erp_honey` et un rôle applicatif non superutilisateur. Si PostgreSQL se trouve sur une autre machine, imposez TLS et limitez les adresses clientes autorisées dans sa configuration réseau.

## 2. Définir les secrets de l'API

Créez `/etc/erp/backend.env`, propriété de `root:erp` avec le mode `640` :

```env
DATABASE_URL="postgresql://erp_app:MOT_DE_PASSE_ENCODE@127.0.0.1:5432/erp_honey?schema=public"
JWT_SECRET="SECRET_ALEATOIRE_LONG"
PORT=3000
```

Générez `JWT_SECRET` avec `openssl rand -base64 48`. Ne placez pas `SHADOW_DATABASE_URL` dans ce fichier : les migrations de production utilisent `prisma migrate deploy` et n'ont pas besoin de base miroir.

## 3. Construire et installer l'API

Effectuez ces opérations depuis un clone propre correspondant au SHA à publier. Conservez l'identifiant du SHA dans votre journal de version.

```bash
cd /srv/erp/backend
npm ci
npx prisma generate
npm run build
```

Copiez le contenu de `backend/.env.example` uniquement comme référence. systemd lit le fichier `/etc/erp/backend.env`, ce qui évite de placer les secrets dans le répertoire du dépôt.

Avant le premier démarrage d'une version, sauvegardez PostgreSQL puis appliquez les migrations avec l'environnement réel :

```bash
set -a
. /etc/erp/backend.env
set +a
cd /srv/erp/backend
npx prisma migrate deploy
```

Exécutez cette commande une seule fois par version, jamais en parallèle sur plusieurs nœuds. N'utilisez pas `migrate dev`, `db push` ou une commande de réinitialisation sur la base de production.

## 4. Exécuter l'API avec systemd

Créez `/etc/systemd/system/erp-backend.service` :

```ini
[Unit]
Description=ERP Honey API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=erp
Group=erp
WorkingDirectory=/srv/erp/backend
EnvironmentFile=/etc/erp/backend.env
ExecStart=/usr/bin/npm run start:prod
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/srv/erp/backend

[Install]
WantedBy=multi-user.target
```

Vérifiez le chemin de Node et npm avec `command -v node` et `command -v npm`. Adaptez `ExecStart` si votre installation Node ne fournit pas npm dans `/usr/bin`.

Activez ensuite le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now erp-backend
sudo systemctl status erp-backend
sudo journalctl -u erp-backend -f
```

L'application écoute actuellement sur toutes les interfaces lorsque `PORT=3000`. Limitez ce port avec le pare-feu et Nginx. Une future évolution devrait faire écouter NestJS explicitement sur `127.0.0.1`.

## 5. Construire les interfaces web

Le portail ERP lit `VITE_API_URL` au moment du build. Cette URL sera visible dans les fichiers JavaScript générés.

```bash
cd /srv/erp/frontend
npm ci
VITE_API_URL=https://api.example.com npm run build
sudo rsync -a --delete dist/ /srv/www/erp/
```

Nginx sert ensuite `/srv/www/erp`. Conservez une copie du répertoire `dist` du déploiement précédent afin de pouvoir restaurer rapidement la version web.

Pour l'administration, la même construction technique s'applique :

```bash
cd /srv/erp/admin
npm ci
VITE_API_URL=https://api.example.com npm run build
sudo rsync -a --delete dist/ /srv/www/admin/
```

Le code actuel de l'administration ignore `VITE_API_URL` et appelle `http://localhost:3001`. Ne publiez pas le site admin auprès d'utilisateurs distants tant qu'une livraison de code n'aura pas remplacé cette valeur figée.

## 6. Publier avec Nginx

Exemple de configuration, à adapter aux noms DNS et aux certificats fournis par votre mécanisme TLS :

```nginx
server {
    listen 443 ssl http2;
    server_name erp.example.com;
    root /srv/www/erp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ajoutez un troisième bloc identique au premier pour `admin.example.com`, avec `root /srv/www/admin`, après résolution du blocage d'URL de l'admin. Configurez les certificats dans les blocs Nginx selon l'autorité de certification choisie, puis testez et rechargez :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Le code API autorise actuellement toutes les origines CORS. Corrigez ce comportement dans une livraison applicative avant de vous appuyer sur les domaines ci-dessus comme mécanisme de contrôle d'accès.

## 7. Déployer une nouvelle version

1. Testez le SHA en intégration et sauvegardez la base.
2. Copiez ou récupérez le nouveau code sous un répertoire de release distinct, par exemple `/srv/erp/releases/<sha>`.
3. Installez, générez Prisma et construisez l'API dans cette release.
4. Lancez `npx prisma migrate deploy` avec les secrets de production.
5. Basculez le lien `/srv/erp/backend` vers la release puis exécutez `sudo systemctl restart erp-backend`.
6. Construisez les fichiers statiques, copiez-les dans les répertoires web et rechargez Nginx.
7. Contrôlez les logs systemd, Nginx et PostgreSQL, puis réalisez une connexion de test.

Pour revenir en arrière, rebasculez le lien vers la release API précédente et redémarrez le service. Restaurez les fichiers statiques précédents. Toute migration de base demande sa propre stratégie de retour, testée avant le déploiement.

## Contrôles finaux

- `systemctl is-active erp-backend` retourne `active`.
- Les journaux n'affichent ni erreur Prisma ni échec de connexion PostgreSQL.
- `https://erp.example.com` charge le portail et contacte `https://api.example.com`.
- Le port `3000` et PostgreSQL ne répondent pas depuis Internet.
- Les certificats TLS sont valides et les sauvegardes sont testées par restauration.

Complétez ce guide avec le [guide général de production](PRODUCTION_DEPLOIEMENT.md) et le [schéma de base de données](BASE_DE_DONNEES.md).
