import React from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import {
  FichePaiePdfDocument,
  type FichePaieData,
  type FichePaieLigne,
} from '../components/dashboard/hr/FichePaiePdf';

export type { FichePaieData, FichePaieLigne };

export const generateFichePaiePdf = async (data: FichePaieData): Promise<Blob> => {
  const element = React.createElement(FichePaiePdfDocument, data);
  return pdf(element as unknown as React.ReactElement<DocumentProps>).toBlob();
};