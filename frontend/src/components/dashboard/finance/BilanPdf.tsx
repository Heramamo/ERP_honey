import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatAr } from '../../../utils/finance';
import { formatMonthYear } from '../../../const/date';

export interface BilanExportRow {
  nom: string;
  totalRevenu: number;
  totalChargesFixe: number;
  totalChargeVariable: number;
  beneficeNet: number;
  marge: number;
}

export interface BilanExportTotals {
  revenus: number;
  chargesFixes: number;
  chargesVariables: number;
  benefice: number;
}

export interface BilanPdfDocumentProps {
  mois: string;
  rows: BilanExportRow[];
  totals: BilanExportTotals;
}

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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 8,
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
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  totalCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  note: {
    fontSize: 7,
    color: '#9ca3af',
    marginTop: 16,
  },
});

const colNom = { width: '30%' };
const colNum = { width: '16%' };

export const BilanPdfDocument: React.FC<BilanPdfDocumentProps> = ({ mois, rows, totals }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brandTitle}>Honey Group</Text>
            <Text style={styles.brandSub}>ERP interne – Gestion financière</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {formatMonthYear(mois).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Bilan mensuel par pôle</Text>
        <Text style={styles.subtitle}>Revenus, charges fixes, charges variables et bénéfice net par pôle d'activité.</Text>

        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, colNom]}>PÔLE D'ACTIVITÉ</Text>
          <Text style={[styles.headerCell, colNum, { textAlign: 'right' }]}>REVENUS</Text>
          <Text style={[styles.headerCell, colNum, { textAlign: 'right' }]}>CH. FIXES</Text>
          <Text style={[styles.headerCell, colNum, { textAlign: 'right' }]}>CH. VARIABLES</Text>
          <Text style={[styles.headerCell, colNum, { textAlign: 'right' }]}>BÉNÉFICE</Text>
          <Text style={[styles.headerCell, { width: '6%', textAlign: 'right' }]}>MARGE</Text>
        </View>

        {rows.map((row) => (
          <View key={row.nom} style={styles.row}>
            <Text style={[styles.cell, colNom]}>{row.nom}</Text>
            <Text style={[styles.cell, colNum, { textAlign: 'right' }]}>{formatAr(row.totalRevenu)}</Text>
            <Text style={[styles.cell, colNum, { textAlign: 'right' }]}>{formatAr(row.totalChargesFixe)}</Text>
            <Text style={[styles.cell, colNum, { textAlign: 'right' }]}>{formatAr(row.totalChargeVariable)}</Text>
            <Text style={[styles.cell, colNum, { textAlign: 'right' }]}>{formatAr(row.beneficeNet)}</Text>
            <Text style={[styles.cell, { width: '6%', textAlign: 'right' }]}>{row.marge.toFixed(1)}%</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={[styles.totalCell, colNom]}>TOTAL</Text>
          <Text style={[styles.totalCell, colNum, { textAlign: 'right' }]}>{formatAr(totals.revenus)}</Text>
          <Text style={[styles.totalCell, colNum, { textAlign: 'right' }]}>{formatAr(totals.chargesFixes)}</Text>
          <Text style={[styles.totalCell, colNum, { textAlign: 'right' }]}>{formatAr(totals.chargesVariables)}</Text>
          <Text style={[styles.totalCell, colNum, { textAlign: 'right' }]}>{formatAr(totals.benefice)}</Text>
          <Text style={[styles.totalCell, { width: '6%', textAlign: 'right' }]}>—</Text>
        </View>

        <Text style={styles.note}>
          Bénéfice net = Revenus - (Charges fixes + Charges variables)
        </Text>
      </Page>
    </Document>
  );