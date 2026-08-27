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
          <tr className="border-b border-[var(--border-subtle)]">
            {columns.map((column, index) => (
              <th key={index} className={`pb-3 px-2 col-heat ${alignClass[column.align ?? 'left']}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {data.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-[var(--chip)] transition">
              {columns.map((column, index) => (
                <td key={index} className={`py-3.5 px-2 ${alignClass[column.align ?? 'left']}`}>
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