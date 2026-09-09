-- CreateTable
CREATE TABLE `Utilisateur` (
    `id_utilisateur` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `mot_de_passe` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'RH', 'FINANCE', 'ENSEIGNANT') NOT NULL DEFAULT 'ENSEIGNANT',
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enseignant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tauxHoraireBase` DOUBLE NOT NULL,
    `statut` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_utilisateur` INTEGER NOT NULL,

    UNIQUE INDEX `Enseignant_id_utilisateur_key`(`id_utilisateur`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeuilleDeTemps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enseignantId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `heuresEffectuees` DOUBLE NOT NULL,
    `heuresSupp` DOUBLE NOT NULL,
    `typeActivite` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `statut` ENUM('VALIDE', 'REFUSE', 'EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
    `valideParId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enseignantId` INTEGER NOT NULL,
    `totalSalaire` DOUBLE NOT NULL,
    `statutpaie` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `mois` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Charge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `typeCharge` VARCHAR(191) NOT NULL,
    `idPole` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Revenu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `montant` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `typeRevenu` VARCHAR(191) NOT NULL,
    `idPole` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enseignant` ADD CONSTRAINT `Enseignant_id_utilisateur_fkey` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeuilleDeTemps` ADD CONSTRAINT `FeuilleDeTemps_enseignantId_fkey` FOREIGN KEY (`enseignantId`) REFERENCES `Enseignant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeuilleDeTemps` ADD CONSTRAINT `FeuilleDeTemps_valideParId_fkey` FOREIGN KEY (`valideParId`) REFERENCES `Utilisateur`(`id_utilisateur`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paie` ADD CONSTRAINT `Paie_enseignantId_fkey` FOREIGN KEY (`enseignantId`) REFERENCES `Enseignant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Charge` ADD CONSTRAINT `Charge_idPole_fkey` FOREIGN KEY (`idPole`) REFERENCES `Pole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revenu` ADD CONSTRAINT `Revenu_idPole_fkey` FOREIGN KEY (`idPole`) REFERENCES `Pole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
