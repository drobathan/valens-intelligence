import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listNotionDatabases } from '@/lib/notion';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const databases = await listNotionDatabases();
    return NextResponse.json({ databases });
  } catch (error: any) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch databases' },
      { status: 500 }
    );
  }
}