/*
  Warnings:

  - You are about to drop the column `email` on the `Enseignant` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Enseignant` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Enseignant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUT_FEUILLE" AS ENUM ('VALIDE', 'REFUSE', 'EN_ATTENTE');

-- DropIndex
DROP INDEX "Enseignant_email_key";

-- AlterTable
ALTER TABLE "Enseignant" DROP COLUMN "email",
DROP COLUMN "nom",
DROP COLUMN "prenom";

-- AlterTable
ALTER TABLE "FeuilleDeTemps" ADD COLUMN     "statut" "STATUT_FEUILLE" NOT NULL DEFAULT 'EN_ATTENTE',
ADD COLUMN     "valideParId" INTEGER;

-- AddForeignKey
ALTER TABLE "FeuilleDeTemps" ADD CONSTRAINT "FeuilleDeTemps_valideParId_fkey" FOREIGN KEY ("valideParId") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE SET NULL ON UPDATE CASCADE;
