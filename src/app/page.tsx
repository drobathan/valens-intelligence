'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DataTable from '@/components/DataTable';
import StatsCards from '@/components/StatsCards';

interface Database {
  id: string;
  title: string;
}

interface DashboardData {
  clientName: string;
  records: Record<string, unknown>[];
  properties: string[];
}

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingDbs, setLoadingDbs] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  // Fetch available databases
  useEffect(() => {
    if (!isLoaded || !userId) return;

    async function load() {
      try {
        const res = await fetch('/api/notion/databases');
        const json = await res.json();
        setDatabases(json.databases || []);
        if (json.databases?.length > 0) {
          setSelectedDb(json.databases[0].id);
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
      } finally {
        setLoadingDbs(false);
      }
    }
    load();
  }, [isLoaded, userId]);

  // Fetch data when selected database changes
  useEffect(() => {
    if (!selectedDb) return;

    async function loadData() {
      setLoadingData(true);
      try {
        const res = await fetch(
          `/api/notion/data?databaseId=${encodeURIComponent(selectedDb!)}`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [selectedDb]);

  // Show nothing while checking auth
  if (!isLoaded || !userId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const selectedTitle =
    databases.find((d) => d.id === selectedDb)?.title || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        databases={databases}
        selectedDb={selectedDb}
        onSelectDb={setSelectedDb}
        loading={loadingDbs}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-6 backdrop-blur-md">
          <h1 className="text-lg font-semibold text-white">{selectedTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Powered by Valens Advisory
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6 p-6">
          {loadingData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl border border-gray-800 bg-gray-900"
                  />
                ))}
              </div>
              <div className="h-96 animate-pulse rounded-xl border border-gray-800 bg-gray-900" />
            </div>
          ) : data && data.records.length > 0 ? (
            <>
              <StatsCards
                records={data.records}
                properties={data.properties}
              />
              <DataTable
                properties={data.properties}
                records={data.records}
              />
            </>
          ) : selectedDb ? (
            <div className="flex h-96 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-gray-600"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
                <p className="text-gray-400">
                  No records found in this database
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Ensure data exists and the Notion integration has access
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl border border-gray-800 bg-gray-900">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-400">
                  Welcome to Valens Intelligence
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Select a database from the sidebar to view your data
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
