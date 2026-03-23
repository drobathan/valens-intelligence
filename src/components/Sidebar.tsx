'use client';

import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';

interface Database {
  id: string;
  title: string;
}

interface SidebarProps {
  databases: Database[];
  selectedDb: string | null;
  onSelectDb: (id: string) => void;
  loading: boolean;
}

export default function Sidebar({
  databases,
  selectedDb,
  onSelectDb,
  loading,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <span className="text-sm font-bold text-gray-950">V</span>
            </div>
            <span className="text-sm font-semibold text-white">
              Valens Intelligence
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>
      </div>

      {/* Database List */}
      <nav className="flex-1 overflow-y-auto p-3">
        {!collapsed && (
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Databases
          </p>
        )}
        {loading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </div>
        ) : databases.length === 0 ? (
          !collapsed && (
            <p className="px-2 text-xs text-gray-500">
              No databases found. Check your Notion API key.
            </p>
          )
        ) : (
          <ul className="space-y-1">
            {databases.map((db) => (
              <li key={db.id}>
                <button
                  onClick={() => onSelectDb(db.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedDb === db.id
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={db.title}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                    <path d="M3 12A9 3 0 0 0 21 12" />
                  </svg>
                  {!collapsed && (
                    <span className="truncate">{db.title}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-2 px-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
          {!collapsed && (
            <span className="text-xs text-gray-400">Account</span>
          )}
        </div>
      </div>
    </aside>
  );
}
