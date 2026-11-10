# Schéma et relations de la base de données

## Source de vérité

Le schéma est défini dans `backend/prisma/schema.prisma`. PostgreSQL applique la première migration versionnée dans `backend/prisma/migrations/20260909103805_a/migration.sql`. Ce document décrit ce schéma sans le modifier.

## Modèle relationnel

```mermaid
erDiagram
  UTILISATEUR ||--o| ENSEIGNANT : "possède un profil"
  ENSEIGNANT ||--o{ FEUILLE_DE_TEMPS : "déclare"
  UTILISATEUR o|--o{ FEUILLE_DE_TEMPS : "valide"
  ENSEIGNANT ||--o{ PAIE : "reçoit"
  POLE ||--o{ CHARGE : "regroupe"
  POLE ||--o{ REVENU : "regroupe"

  UTILISATEUR {
    int id_utilisateur PK
    string email UK
    string mot_de_passe
    string nom
    string prenom
    Role role
    datetime date_creation
  }
  ENSEIGNANT {
    int id PK
    float tauxHoraireBase
    string statut
    datetime createdAt
    datetime updatedAt
    int id_utilisateur FK_UK
  }
  FEUILLE_DE_TEMPS {
    int id PK
    int enseignantId FK
    datetime date
    float heuresEffectuees
    float heuresSupp
    string typeActivite
    STATUT_FEUILLE statut
    int valideParId FK_NULL
  }
  PAIE {
    int id PK
    int enseignantId FK
    float totalSalaire
    string statutpaie
    datetime date
    string mois
  }
  POLE {
    int id PK
    string nom
    string description
  }
  CHARGE {
    int id PK
    string libelle
    float montant
    datetime date
    string typeCharge
    int idPole FK
  }
  REVENU {
    int id PK
    string libelle
    float montant
    datetime date
    string typeRevenu
    int idPole FK
  }
```

La relation `Utilisateur` vers `Enseignant` est optionnelle côté utilisateur : un compte n'a pas nécessairement de profil enseignant. Lorsqu'il existe, le profil ne peut appartenir qu'à un seul compte, car `Enseignant.id_utilisateur` est unique.

## Types énumérés

| Type | Valeurs | Utilisation |
| --- | --- | --- |
| `Role` | `ADMIN`, `RH`, `FINANCE`, `ENSEIGNANT` | `Utilisateur.role`, défaut `ENSEIGNANT` |
| `STATUT_FEUILLE` | `VALIDE`, `REFUSE`, `EN_ATTENTE` | `FeuilleDeTemps.statut`, défaut `EN_ATTENTE` |

`statut`, `statutpaie`, `typeActivite`, `typeCharge` et `typeRevenu` restent des textes libres dans le schéma actuel.

## Tables et colonnes

### `Utilisateur`

| Colonne | Type PostgreSQL | Règle |
| --- | --- | --- |
| `id_utilisateur` | `SERIAL` | clé primaire |
| `email` | `TEXT` | obligatoire, unique |
| `mot_de_passe` | `TEXT` | obligatoire ; le service doit y stocker un hash, jamais un mot de passe clair |
| `nom`, `prenom` | `TEXT` | obligatoires |
| `role` | enum `Role` | obligatoire, défaut `ENSEIGNANT` |
| `date_creation` | `TIMESTAMP(3)` | obligatoire, défaut `CURRENT_TIMESTAMP` |

### `Enseignant`

| Colonne | Type PostgreSQL | Règle |
| --- | --- | --- |
| `id` | `SERIAL` | clé primaire |
| `tauxHoraireBase` | `DOUBLE PRECISION` | obligatoire |
| `statut` | `TEXT` | obligatoire |
| `createdAt`, `updatedAt` | `TIMESTAMP(3)` | obligatoires ; Prisma alimente `updatedAt` lors d'une mise à jour ORM |
| `id_utilisateur` | `INTEGER` | clé étrangère unique vers `Utilisateur.id_utilisateur` |

### `FeuilleDeTemps`

| Colonne | Type PostgreSQL | Règle |
| --- | --- | --- |
| `id` | `SERIAL` | clé primaire |
| `enseignantId` | `INTEGER` | clé étrangère obligatoire vers `Enseignant.id` |
| `date` | `TIMESTAMP(3)` | obligatoire |
| `heuresEffectuees`, `heuresSupp` | `DOUBLE PRECISION` | obligatoires |
| `typeActivite` | `TEXT` | obligatoire |
| `statut` | enum `STATUT_FEUILLE` | obligatoire, défaut `EN_ATTENTE` |
| `valideParId` | `INTEGER` | clé étrangère facultative vers `Utilisateur.id_utilisateur` |
| `createdAt`, `updatedAt` | `TIMESTAMP(3)` | obligatoires |

### `Paie`

| Colonne | Type PostgreSQL | Règle |
| --- | --- | --- |
| `id` | `SERIAL` | clé primaire |
| `enseignantId` | `INTEGER` | clé étrangère obligatoire vers `Enseignant.id` |
| `totalSalaire` | `DOUBLE PRECISION` | obligatoire |
| `statutpaie`, `mois` | `TEXT` | obligatoires |
| `date`, `createdAt`, `updatedAt` | `TIMESTAMP(3)` | obligatoires |

### `Pole`, `Charge` et `Revenu`

| Table | Colonnes métier | Rattachement |
| --- | --- | --- |
| `Pole` | `id`, `nom`, `description`, `createdAt`, `updatedAt` | racine financière |
| `Charge` | `id`, `libelle`, `montant`, `date`, `typeCharge`, `createdAt`, `updatedAt` | `idPole` obligatoire vers `Pole.id` |
| `Revenu` | `id`, `libelle`, `montant`, `date`, `typeRevenu`, `createdAt`, `updatedAt` | `idPole` obligatoire vers `Pole.id` |

Les montants et taux utilisent `DOUBLE PRECISION`. Cette représentation binaire peut introduire des écarts d'arrondi pour des calculs monétaires. Le schéma actuel reste la source de vérité ; toute évolution vers `DECIMAL/NUMERIC` exige une migration et des tests dans une livraison séparée.

## Intégrité référentielle et suppressions

| Enfant | Parent | Suppression du parent | Effet |
| --- | --- | --- | --- |
| `Enseignant.id_utilisateur` | `Utilisateur.id_utilisateur` | `CASCADE` | supprime le profil enseignant |
| `FeuilleDeTemps.enseignantId` | `Enseignant.id` | `RESTRICT` | refuse la suppression tant que des feuilles existent |
| `FeuilleDeTemps.valideParId` | `Utilisateur.id_utilisateur` | `SET NULL` | conserve la feuille, efface le validateur |
| `Paie.enseignantId` | `Enseignant.id` | `RESTRICT` | refuse la suppression tant que des paies existent |
| `Charge.idPole` | `Pole.id` | `RESTRICT` | refuse la suppression tant que des charges existent |
| `Revenu.idPole` | `Pole.id` | `RESTRICT` | refuse la suppression tant que des revenus existent |

Les clés étrangères appliquent aussi `ON UPDATE CASCADE`. Les clés primaires `SERIAL` ne sont normalement pas modifiées par l'application.

## Index et contraintes existants

PostgreSQL crée des index pour les clés primaires. Le schéma ajoute deux contraintes d'unicité :

- `Utilisateur_email_key` sur `Utilisateur.email` ;
- `Enseignant_id_utilisateur_key` sur `Enseignant.id_utilisateur`.

La migration ne crée aucun index explicite sur `FeuilleDeTemps.enseignantId`, `FeuilleDeTemps.statut`, les dates, `Paie.enseignantId`, `Charge.idPole` ni `Revenu.idPole`. Mesurez les requêtes réelles avant d'ajouter des index dans une future migration.

## Cycle de vie des données

1. Un compte est créé dans `Utilisateur` avec un rôle.
2. Un compte enseignant complète son profil : une ligne `Enseignant` est créée et liée à son compte.
3. L'enseignant enregistre des `FeuilleDeTemps`, initialement `EN_ATTENTE`.
4. Un utilisateur RH ou administrateur renseigne le statut et devient le validateur référencé par `valideParId`.
5. La paie utilise les informations d'un enseignant et crée une ligne `Paie`.
6. La finance attache charges et revenus à un `Pole`, puis consulte le bilan du pôle.

## Exploitation de la base

Appliquez les évolutions exclusivement depuis les migrations Prisma versionnées :

```bash
cd backend
npx prisma migrate deploy
```

Sauvegardez la base avant cette commande. Pour consulter les données, privilégiez un accès SQL en lecture seule ou une instance isolée de Prisma Studio ; Prisma Studio ne doit pas être publié sur Internet.
