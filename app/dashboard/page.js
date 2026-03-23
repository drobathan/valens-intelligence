/**
 * Dashboard page — server component.
 *
 * How it works:
 * 1. Clerk middleware (middleware.js) blocks anyone not logged in.
 * 2. This page reads the logged-in user's `clientId` from their Clerk metadata.
 * 3. It looks up that clientId in config/clients.js to get their Notion IDs.
 * 4. It fetches only that client's data from Notion.
 * 5. Each client can only ever see their own data — there is no cross-over.
 *
 * To assign a client to a user:
 *   In the Clerk dashboard → Users → [select user] → Public Metadata:
 *   { "clientId": "tmo-highways" }
 */
import { currentUser } from '@clerk/nextjs/server';
import { getDashboardData } from '@/lib/notion';
import { getTerminology } from '@/config/terminology';
import { getClientConfig } from '@/config/clients';
import Dashboard from '@/components/Dashboard';

// Revalidate every 5 minutes (ISR)
export const revalidate = 300;

// Shared styles for error screens
const errorScreen = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '100vh', background: '#0B1C2D', color: '#fff',
  fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: '12px',
};
const errorTitle = { color: '#C6A75E', fontSize: '18px', fontWeight: 500, margin: 0 };
const errorSub   = { color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: 0 };

export default async function DashboardPage() {
  const user = await currentUser();
  const clientId = user?.publicMetadata?.clientId;

  // No clientId set — user exists in Clerk but Dan hasn't assigned them yet
  if (!clientId) {
    return (
      <div style={errorScreen}>
        <p style={errorTitle}>Access not configured</p>
        <p style={errorSub}>Please contact Valens Advisory to activate your dashboard.</p>
      </div>
    );
  }

  const clientConfig = getClientConfig(clientId);

  // clientId set but not in the registry — typo in Clerk metadata
  if (!clientConfig) {
    return (
      <div style={errorScreen}>
        <p style={errorTitle}>Unknown client ID: "{clientId}"</p>
        <p style={errorSub}>Please contact Valens Advisory to resolve this.</p>
      </div>
    );
  }

  const data = await getDashboardData(clientConfig);
  const terminology = getTerminology(clientConfig.clientType);

  return <Dashboard data={data} terminology={terminology} />;
}
