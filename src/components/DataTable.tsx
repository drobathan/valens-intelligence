'use client';

interface DataTableProps {
  properties: string[];
  records: Record<string, unknown>[];
}

export default function DataTable({ properties, records }: DataTableProps) {
  if (records.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
        <p className="text-gray-500">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              {properties.map((prop) => (
                <th
                  key={prop}
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400"
                >
                  {prop}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {records.map((record, idx) => (
              <tr
                key={idx}
                className="transition-colors hover:bg-gray-800/30"
              >
                {properties.map((prop) => (
                  <td
                    key={prop}
                    className="whitespace-nowrap px-4 py-3 text-gray-300"
                  >
                    {formatCellValue(record[prop])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
