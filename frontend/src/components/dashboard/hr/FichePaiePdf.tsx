import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatNumber } from '../../../utils/finance';

export interface FichePaieLigne {
  designation: string;
  heures: number;
  taux: number;
  montant: number;
}

export interface FichePaieData {
  paieId: number;
  mois: string;
  date: string;
  statut: string;
  nom: string;
  prenom: string;
  email: string;
  tauxHoraire: number;
  lignes: FichePaieLigne[];
  brut: number;
  netAPayer: number;
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const formatMois = (mois: string): string => {
  const [year, month] = mois.split('-');
  const label = MONTHS_FR[Number(month) - 1];
  return label ? `${label} ${year}` : mois;
};

const formatH = (h: number): string => `${(Math.round(h * 10) / 10).toString().replace('.', ',')} h`;
const formatDateFr = (value: string | Date): string =>
  new Date(value).toLocaleDateString('fr-FR');

const statutLabel = (statut: string): string => {
  switch (statut) {
    case 'PAYE': return 'Payé';
    case 'EN_ATTENTE': return 'En attente';
    default: return statut;
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#6b7280',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  brandSub: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#c8932a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1408',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 12,
  },
  meta: {
    fontSize: 8,
    color: '#9ca3af',
  },
  metaValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoTable: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  infoRowLast: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  infoCell: {
    width: '25%',
    fontSize: 8,
    color: '#9ca3af',
  },
  infoValue: {
    width: '25%',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1d2733',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  headerCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 7,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cell: {
    fontSize: 8,
    color: '#374151',
  },
  brutRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  brutCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
  },
  netRow: {
    flexDirection: 'row',
    backgroundColor: '#c8932a',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginTop: 12,
  },
  netCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1a1408',
  },
  note: {
    fontSize: 7,
    color: '#9ca3af',
    marginTop: 14,
  },
});

const colDesignation = { width: '40%' };
const colHeures = { width: '18%' };
const colTaux = { width: '20%' };
const colMontant = { width: '22%' };

export const FichePaiePdfDocument: React.FC<FichePaieData> = ({
  paieId,
  mois,
  date,
  statut,
  nom,
  prenom,
  email,
  tauxHoraire,
  lignes,
  brut,
  netAPayer,
}) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brandTitle}>Honey Group</Text>
            <Text style={styles.brandSub}>ERP interne – Gestion de paie</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FICHE DE PAIE</Text>
          </View>
        </View>

        <Text style={styles.title}>Fiche de paie détaillée</Text>
        <Text style={styles.subtitle}>
          Fiche n° {paieId} – {formatMois(mois)}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            Période : <Text style={styles.metaValue}>{formatMois(mois)}</Text>
          </Text>
          <Text style={styles.meta}>
            Émise le : <Text style={styles.metaValue}>{formatDateFr(date)}</Text>
          </Text>
          <Text style={styles.meta}>
            Statut : <Text style={styles.metaValue}>{statutLabel(statut)}</Text>
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Employé</Text>
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoCell}>Nom</Text>
            <Text style={styles.infoValue}>{nom}</Text>
            <Text style={styles.infoCell}>Prénom</Text>
            <Text style={styles.infoValue}>{prenom}</Text>
          </View>
          <View style={styles.infoRowLast}>
            <Text style={styles.infoCell}>Email</Text>
            <Text style={styles.infoValue}>{email}</Text>
            <Text style={styles.infoCell}>Taux horaire</Text>
            <Text style={styles.infoValue}>{formatNumber(tauxHoraire)} Ar/h</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Détail des rémunérations</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, colDesignation]}>DÉSIGNATION</Text>
          <Text style={[styles.headerCell, colHeures, { textAlign: 'right' }]}>HEURES</Text>
          <Text style={[styles.headerCell, colTaux, { textAlign: 'right' }]}>TAUX</Text>
          <Text style={[styles.headerCell, colMontant, { textAlign: 'right' }]}>MONTANT</Text>
        </View>

        {lignes.map((ligne) => (
          <View key={ligne.designation} style={styles.row}>
            <Text style={[styles.cell, colDesignation]}>{ligne.designation}</Text>
            <Text style={[styles.cell, colHeures, { textAlign: 'right' }]}>{formatH(ligne.heures)}</Text>
            <Text style={[styles.cell, colTaux, { textAlign: 'right' }]}>{formatNumber(ligne.taux)} Ar</Text>
            <Text style={[styles.cell, colMontant, { textAlign: 'right' }]}>{formatNumber(ligne.montant)} Ar</Text>
          </View>
        ))}

        <View style={styles.brutRow}>
          <Text style={[styles.brutCell, colDesignation]}>Salaire brut</Text>
          <Text style={[styles.brutCell, colHeures, { textAlign: 'right' }]}>—</Text>
          <Text style={[styles.brutCell, colTaux, { textAlign: 'right' }]}>—</Text>
          <Text style={[styles.brutCell, colMontant, { textAlign: 'right' }]}>{formatNumber(brut)} Ar</Text>
        </View>

        <View style={styles.netRow}>
          <Text style={[styles.netCell, colDesignation]}>NET À PAYER</Text>
          <Text style={[styles.netCell, colHeures, { textAlign: 'right' }]}>—</Text>
          <Text style={[styles.netCell, colTaux, { textAlign: 'right' }]}>—</Text>
          <Text style={[styles.netCell, colMontant, { textAlign: 'right' }]}>{formatNumber(netAPayer)} Ar</Text>
        </View>

        <Text style={styles.note}>
          Salaire brut = Heures normales × taux horaire + Heures supplémentaires × taux horaire × 1,25.
        </Text>
      </Page>
    </Document>
  );