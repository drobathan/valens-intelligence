/**
 * Valens Intelligence — Notion Data Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * All Notion API calls live here. This file is server-side only — the API key
 * is never sent to the browser.
 *
 * Functions exported:
 *   getGSIScorecard()        → Parses the GSI Scorecard page blocks
 *   getDecisions()           → Queries the Decision Scorecard database
 *   getOpenActions()         → Queries the Open Actions database
 *   getAssessmentHistory()   → Queries the Assessment History database
 *   getDashboardData()       → Calls all three and returns merged payload
 */

import { Client } from '@notionhq/client';

// Initialise the Notion client (server-side only)
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ─── Helper: extract plain text from a rich text array ─────────────────────
function richText(arr = []) {
  return arr.map((r) => r.plain_text).join('');
}

// ─── Helper: get a property value by type ──────────────────────────────────
function prop(page, name) {
  const p = page.properties?.[name];
  if (!p) return null;
  switch (p.type) {
    case 'title':      return richText(p.title);
    case 'rich_text':  return richText(p.rich_text);
    case 'number':     return p.number;
    case 'select':     return p.select?.name ?? null;
    case 'multi_select': return p.multi_select.map((s) => s.name);
    case 'date':       return p.date?.start ?? null;
    case 'people':     return p.people.map((u) => u.name ?? u.id);
    case 'checkbox':   return p.checkbox;
    case 'url':        return p.url;
    case 'email':      return p.email;
    default:           return null;
  }
}

// ─── GSI Scorecard ──────────────────────────────────────────────────────────
/**
 * Reads the GSI Scorecard Notion page and parses the inline table blocks
 * to return structured scorecard data.
 *
 * NOTE: The current Notion structure stores the GSI score as page content
 * (an inline table with [80] notation). This parser handles that format.
 * For easier long-term maintenance, consider migrating to a dedicated
 * GSI Assessments database (see deployment guide).
 */
export async function getGSIScorecard(clientConfig = {}) {
  const pageId = clientConfig.notionGsiPageId ?? process.env.NOTION_GSI_PAGE_ID;

  // Fetch all blocks on the scorecard page
  const { results: blocks } = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  // Default values — overridden as we parse blocks
  let gsiScore = null;
  let stabilityBand = null;
  let assessmentDate = null;
  let executiveThesis = null;
  let primaryExposure = null;
  const pillars = [];

  for (const block of blocks) {
    // ── Parse table blocks ─────────────────────────────────────────────────
    if (block.type === 'table') {
      // Fetch table rows
      const { results: rows } = await notion.blocks.children.list({
        block_id: block.id,
        page_size: 50,
      });

      for (const row of rows) {
        if (row.type !== 'table_row') continue;
        const cells = row.table_row.cells.map((cell) => richText(cell));

        // Identify summary row: [score], stability band
        if (cells[0]?.includes('[') && !cells[0].includes('/')) {
          const scoreMatch = cells[0].match(/\[(\d+)\]/);
          if (scoreMatch) gsiScore = parseInt(scoreMatch[1], 10);
          if (cells[1]) stabilityBand = cells[1].replace(/[\[\]]/g, '').trim();
          if (cells[2]) assessmentDate = cells[2];
          continue;
        }

        // Identify pillar rows: "Pillar Name", score, max, weight
        if (cells.length >= 3 && /\d/.test(cells[1])) {
          const name = cells[0];
          const score = parseInt(cells[1], 10);
          const max = parseInt(cells[2], 10) || parseInt(cells[1], 10);
          const weight = cells[3] || '';

          if (name && !isNaN(score)) {
            pillars.push({ name, score, max, weight });
          }
          continue;
        }

        // Identify executive thesis / primary exposure
        if (cells[0]?.toLowerCase().includes('executive thesis')) {
          executiveThesis = cells[1];
        }
        if (cells[0]?.toLowerCase().includes('primary exposure')) {
          primaryExposure = cells[1];
        }
      }
    }

    // ── Parse paragraph blocks for fallback extraction ─────────────────────
    if (block.type === 'paragraph') {
      const text = richText(block.paragraph.rich_text);
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch && !assessmentDate) assessmentDate = dateMatch[0];
    }
  }

  // Fallback: if pillars empty, return known static data
  // (Remove this fallback once Notion data is fully structured)
  const finalPillars = pillars.length > 0 ? pillars : [
    { name: 'Board Composition & Effectiveness',    score: 20, max: 20, weight: '20%' },
    { name: 'Strategic Oversight & Risk Management', score: 15, max: 20, weight: '20%' },
    { name: 'Financial Controls & Sustainability',   score: 15, max: 20, weight: '20%' },
    { name: 'Stakeholder Relations & Transparency',  score: 5,  max: 15, weight: '15%' },
    { name: 'Operational Governance',                score: 15, max: 15, weight: '15%' },
    { name: 'Culture & Values Alignment',            score: 10, max: 10, weight: '10%' },
  ];

  return {
    score:          gsiScore ?? 80,
    stabilityBand:  stabilityBand ?? 'stable',
    assessmentDate: assessmentDate ?? '2026-03-11',
    executiveThesis: executiveThesis ?? 'Stable',
    primaryExposure: primaryExposure ?? 'Marketing',
    pillars: finalPillars,
  };
}

// ─── Decisions ──────────────────────────────────────────────────────────────
/**
 * Returns all decisions from the Decision Scorecard database,
 * sorted by IC Date descending (most recent first).
 */
export async function getDecisions(clientConfig = {}) {
  const dbId = clientConfig.notionDecisionsDbId ?? process.env.NOTION_DECISIONS_DB_ID;

  const { results } = await notion.databases.query({
    database_id: dbId,
    sorts: [{ property: 'IC Date', direction: 'descending' }],
    page_size: 20,
  });

  return results.map((page) => ({
    id:       page.id,
    ref:      prop(page, 'Ref')      ?? '—',
    decision: prop(page, 'Decision') ?? '—',
    stage:    prop(page, 'Stage')    ?? '—',
    dqScore:  prop(page, 'DQ Score') ?? null,
    status:   prop(page, 'Status')   ?? '—',
    icDate:   prop(page, 'IC Date')  ?? null,
    owner:    prop(page, 'Owner')    ?? '—',
  }));
}

// ─── Open Actions ───────────────────────────────────────────────────────────
/**
 * Returns all open actions from the Open Actions database,
 * sorted by Action Date ascending (earliest due date first).
 */
export async function getOpenActions(clientConfig = {}) {
  const dbId = clientConfig.notionActionsDbId ?? process.env.NOTION_ACTIONS_DB_ID;

  const { results } = await notion.databases.query({
    database_id: dbId,
    sorts: [{ property: 'Action Date', direction: 'ascending' }],
    page_size: 20,
  });

  return results.map((page) => ({
    id:         page.id,
    actionName: prop(page, 'Action Name')   ?? '—',
    dueDate:    prop(page, 'Action Date')   ?? null,
    status:     prop(page, 'Action Status') ?? '—',
  }));
}

// ─── Assessment History ─────────────────────────────────────────────────────
/**
 * Returns historical GSI assessments for the trend chart.
 *
 * NOTE: The current Notion Assessment History database is set up as a
 * template/guide. Once you populate it with real assessment records
 * (see deployment guide), this function will return live data.
 * Until then it returns a placeholder trend dataset.
 */
export async function getAssessmentHistory(clientConfig = {}) {
  const dbId = clientConfig.notionHistoryDbId ?? process.env.NOTION_ASSESSMENT_HISTORY_DB_ID;

  try {
    const { results } = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: 'Assessment Date', direction: 'ascending' }],
      page_size: 50,
    });

    const assessments = results
      .map((page) => ({
        date:  prop(page, 'Assessment Date') ?? prop(page, 'Date') ?? null,
        score: prop(page, 'GSI Score') ?? prop(page, 'Score') ?? null,
        band:  prop(page, 'Stability Band') ?? null,
      }))
      .filter((a) => a.date && a.score !== null);

    // If real data exists, return it
    if (assessments.length > 0) return assessments;
  } catch {
    // Database may not have expected fields yet — fall through to placeholder
  }

  // Placeholder trend data — replace with real assessments as you log them
  return [
    { date: '2025-09-01', score: 65, band: 'fragile' },
    { date: '2025-10-01', score: 68, band: 'fragile' },
    { date: '2025-11-01', score: 71, band: 'developing' },
    { date: '2025-12-01', score: 69, band: 'developing' },
    { date: '2026-01-01', score: 75, band: 'stable' },
    { date: '2026-02-01', score: 77, band: 'stable' },
    { date: '2026-03-11', score: 80, band: 'stable' },
  ];
}

// ─── Merged Dashboard Payload ───────────────────────────────────────────────
/**
 * Fetches all dashboard data in parallel and returns a single merged object.
 * Called by the /api/notion/dashboard route.
 */
export async function getDashboardData(clientConfig = {}) {
  const [scorecard, decisions, openActions, assessmentHistory] =
    await Promise.all([
      getGSIScorecard(clientConfig),
      getDecisions(clientConfig),
      getOpenActions(clientConfig),
      getAssessmentHistory(clientConfig),
    ]);

  return {
    scorecard,
    decisions,
    openActions,
    assessmentHistory,
    meta: {
      clientName:     clientConfig.name           ?? process.env.CLIENT_NAME     ?? 'Client',
      engagementId:   process.env.ENGAGEMENT_ID   ?? '',
      engagementLead: clientConfig.engagementLead ?? process.env.ENGAGEMENT_LEAD ?? '',
      clientType:     clientConfig.clientType     ?? process.env.CLIENT_TYPE      ?? 'PE',
    },
  };
}
