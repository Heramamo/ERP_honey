-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RH', 'FINANCE', 'ENSEIGNANT');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ENSEIGNANT',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_enseignant" INTEGER,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_id_enseignant_key" ON "Utilisateur"("id_enseignant");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_id_enseignant_fkey" FOREIGN KEY ("id_enseignant") REFERENCES "Enseignant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
