/**
 * GET /api/notion/dashboard
 *
 * Server-side API route that fetches all dashboard data from Notion.
 * Protected by Clerk auth — only authenticated users can call this.
 * The Notion API key is never sent to the client.
 *
 * Returns: JSON dashboard payload (scorecard, decisions, actions, history, meta)
 */

import { auth } from '@clerk/nextjs/server';
import { getDashboardData } from '@/lib/notion';
import { NextResponse } from 'next/server';

export async function GET() {
  // Ensure the user is authenticated — Clerk v5: auth() must be awaited
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const data = await getDashboardData();
    return NextResponse.json(data, {
      headers: {
        // Cache for 5 minutes on the server, allow stale for 10 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[Notion API Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', detail: error.message },
      { status: 500 }
    );
  }
}
