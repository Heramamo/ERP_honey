import React from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import {
  BilanPdfDocument,
  type BilanPdfDocumentProps,
  type BilanExportRow,
  type BilanExportTotals,
} from '../components/dashboard/finance/BilanPdf';

export type { BilanExportRow, BilanExportTotals };

export const generateBilanPdf = async (data: BilanPdfDocumentProps): Promise<Blob> => {
  const element = React.createElement(BilanPdfDocument, data);
  return pdf(element as unknown as React.ReactElement<DocumentProps>).toBlob();
};