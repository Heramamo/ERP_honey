/*
  Warnings:

  - You are about to drop the column `id_enseignant` on the `Utilisateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_utilisateur]` on the table `Enseignant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_utilisateur` to the `Enseignant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_id_enseignant_fkey";

-- DropIndex
DROP INDEX "Utilisateur_id_enseignant_key";

-- AlterTable
ALTER TABLE "Enseignant" ADD COLUMN     "id_utilisateur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "id_enseignant";

-- CreateIndex
CREATE UNIQUE INDEX "Enseignant_id_utilisateur_key" ON "Enseignant"("id_utilisateur");

-- AddForeignKey
ALTER TABLE "Enseignant" ADD CONSTRAINT "Enseignant_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
