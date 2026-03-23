'use client';

interface StatsCardsProps {
  records: Record<string, unknown>[];
  properties: string[];
}

export default function StatsCards({ records, properties }: StatsCardsProps) {
  // Compute some summary stats
  const totalRecords = records.length;

  // Find numeric properties for aggregation
  const numericProps = properties.filter((prop) =>
    records.some((r) => typeof r[prop] === 'number')
  );

  // Find select/status properties for breakdown
  const statusProp = properties.find(
    (p) =>
      p.toLowerCase().includes('status') ||
      p.toLowerCase().includes('stage') ||
      p.toLowerCase().includes('phase')
  );

  const statusCounts: Record<string, number> = {};
  if (statusProp) {
    for (const r of records) {
      const val = String(r[statusProp] || 'Unknown');
      statusCounts[val] = (statusCounts[val] || 0) + 1;
    }
  }

  // Compute sum for first numeric property
  let numericSum: number | null = null;
  let numericLabel = '';
  if (numericProps.length > 0) {
    numericLabel = numericProps[0];
    numericSum = records.reduce((sum, r) => {
      const val = r[numericProps[0]];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  }

  const cards = [
    {
      label: 'Total Records',
      value: totalRecords.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/></svg>
      ),
      color: 'amber',
    },
    {
      label: 'Properties',
      value: properties.length.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      ),
      color: 'blue',
    },
  ];

  if (numericSum !== null) {
    cards.push({
      label: `Total ${numericLabel}`,
      value: numericSum.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
      color: 'emerald',
    });
  }

  if (statusProp && Object.keys(statusCounts).length > 0) {
    const topStatus = Object.entries(statusCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    cards.push({
      label: `Top ${statusProp}`,
      value: `${topStatus[0]} (${topStatus[1]})`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ),
      color: 'purple',
    });
  }

  const colorMap: Record<string, string> = {
    amber: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-blue-500/10 text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-800 bg-gray-900 p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {card.label}
            </p>
            <div
              className={`rounded-lg p-2 ${colorMap[card.color] || colorMap.amber}`}
            >
              {card.icon}
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
