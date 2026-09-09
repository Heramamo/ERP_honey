-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RH', 'FINANCE', 'ENSEIGNANT');

-- CreateEnum
CREATE TYPE "STATUT_FEUILLE" AS ENUM ('VALIDE', 'REFUSE', 'EN_ATTENTE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ENSEIGNANT',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Enseignant" (
    "id" SERIAL NOT NULL,
    "tauxHoraireBase" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "Enseignant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeuilleDeTemps" (
    "id" SERIAL NOT NULL,
    "enseignantId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heuresEffectuees" DOUBLE PRECISION NOT NULL,
    "heuresSupp" DOUBLE PRECISION NOT NULL,
    "typeActivite" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statut" "STATUT_FEUILLE" NOT NULL DEFAULT 'EN_ATTENTE',
    "valideParId" INTEGER,

    CONSTRAINT "FeuilleDeTemps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paie" (
    "id" SERIAL NOT NULL,
    "enseignantId" INTEGER NOT NULL,
    "totalSalaire" DOUBLE PRECISION NOT NULL,
    "statutpaie" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mois" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pole" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeCharge" TEXT NOT NULL,
    "idPole" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenu" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeRevenu" TEXT NOT NULL,
    "idPole" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Enseignant_id_utilisateur_key" ON "Enseignant"("id_utilisateur");

-- AddForeignKey
ALTER TABLE "Enseignant" ADD CONSTRAINT "Enseignant_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeuilleDeTemps" ADD CONSTRAINT "FeuilleDeTemps_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Enseignant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeuilleDeTemps" ADD CONSTRAINT "FeuilleDeTemps_valideParId_fkey" FOREIGN KEY ("valideParId") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paie" ADD CONSTRAINT "Paie_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Enseignant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_idPole_fkey" FOREIGN KEY ("idPole") REFERENCES "Pole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenu" ADD CONSTRAINT "Revenu_idPole_fkey" FOREIGN KEY ("idPole") REFERENCES "Pole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
