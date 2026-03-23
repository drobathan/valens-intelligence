import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchNotionDatabase } from '@/lib/notion';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const databaseId = searchParams.get('databaseId');
  const client = searchParams.get('client') || undefined;

  if (!databaseId) {
    return NextResponse.json(
      { error: 'databaseId is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchNotionDatabase(databaseId, client);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}