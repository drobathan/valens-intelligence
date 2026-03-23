import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export interface DashboardData {
  clientName: string;
  records: Record<string, unknown>[];
  properties: string[];
}

/**
 * Fetch pages from a Notion database, optionally filtered by a client identifier.
 */
export async function fetchNotionDatabase(
  databaseId: string,
  clientFilter?: string
): Promise<DashboardData> {
  const filter = clientFilter
    ? {
        property: 'Client',
        rich_text: { equals: clientFilter },
      }
    : undefined;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter as any,
    page_size: 100,
  });

  // Extract property names from the first result
  const properties: string[] = [];
  const records: Record<string, unknown>[] = [];

  for (const page of response.results) {
    if (!('properties' in page)) continue;
    const row: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(page.properties)) {
      if (!properties.includes(key)) properties.push(key);
      row[key] = extractValue(value);
    }

    records.push(row);
  }

  return {
    clientName: clientFilter || 'All Clients',
    records,
    properties,
  };
}

/**
 * List all databases shared with the integration.
 */
export async function listNotionDatabases() {
  const response = await notion.search({
    filter: { property: 'object', value: 'database' },
    page_size: 50,
  });

  return response.results
    .filter((r): r is Extract<typeof r, { object: 'database' }> => 'title' in r)
    .map((db) => ({
      id: db.id,
      title:
        'title' in db && Array.isArray(db.title) && db.title.length > 0
          ? db.title.map((t: any) => t.plain_text).join('')
          : 'Untitled',
    }));
}

/**
 * Extract a human-readable value from a Notion property.
 */
function extractValue(prop: any): unknown {
  if (!prop || !prop.type) return null;

  switch (prop.type) {
    case 'title':
      return prop.title?.map((t: any) => t.plain_text).join('') || '';
    case 'rich_text':
      return prop.rich_text?.map((t: any) => t.plain_text).join('') || '';
    case 'number':
      return prop.number;
    case 'select':
      return prop.select?.name || null;
    case 'multi_select':
      return prop.multi_select?.map((s: any) => s.name) || [];
    case 'date':
      return prop.date?.start || null;
    case 'checkbox':
      return prop.checkbox;
    case 'url':
      return prop.url;
    case 'email':
      return prop.email;
    case 'phone_number':
      return prop.phone_number;
    case 'status':
      return prop.status?.name || null;
    case 'formula':
      return prop.formula?.[prop.formula.type] ?? null;
    case 'rollup':
      if (prop.rollup?.type === 'array') {
        return prop.rollup.array?.map((item: any) => extractValue(item)) || [];
      }
      return prop.rollup?.[prop.rollup.type] ?? null;
    case 'relation':
      return prop.relation?.map((r: any) => r.id) || [];
    case 'people':
      return prop.people?.map((p: any) => p.name || p.id) || [];
    case 'created_time':
      return prop.created_time;
    case 'last_edited_time':
      return prop.last_edited_time;
    case 'created_by':
      return prop.created_by?.name || null;
    case 'last_edited_by':
      return prop.last_edited_by?.name || null;
    case 'files':
      return prop.files?.map((f: any) => f.file?.url || f.external?.url) || [];
    default:
      return null;
  }
}
