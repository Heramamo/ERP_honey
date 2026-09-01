import React from 'react';

export type ColumnAlign = 'left' | 'center' | 'right';

export interface DataColumn<T> {
  header: React.ReactNode;
  align?: ColumnAlign;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
}

const alignClass: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const DataTable = <T,>({ columns, data, rowKey }: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-[var(--t3)] font-semibold text-[10px] uppercase tracking-wider border-b border-[var(--line)]">
            {columns.map((column, index) => (
              <th key={index} className={`pb-2.5 px-2 font-semibold ${alignClass[column.align ?? 'left']}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {data.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-[var(--chip)]/50 transition-colors">
              {columns.map((column, index) => (
                <td key={index} className={`py-3 px-2 ${alignClass[column.align ?? 'left']}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
