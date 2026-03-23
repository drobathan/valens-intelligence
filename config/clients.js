/**
 * Valens Intelligence — Client Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * Each entry represents one client engagement. The key (e.g. 'tmo-highways')
 * is the clientId — this is what you set in Clerk when you invite a user.
 *
 * HOW TO ADD A NEW CLIENT:
 * 1. Duplicate the 'tmo-highways' block below and give it a new key.
 * 2. Fill in the client's name, type (PE / SPORTS / TECH), and Notion IDs.
 * 3. In Clerk, invite the client's email address.
 * 4. In Clerk, set that user's "Public Metadata" to:
 *      { "clientId": "your-new-key" }
 * 5. Save & push to GitHub — Vercel rebuilds automatically.
 *
 * The client can only ever see data tied to their own clientId.
 * There is no way for them to access another client's data.
 */

export const clients = {

  // ── TMO Highways ───────────────────────────────────────────────────────────
  'tmo-highways': {
    name: 'TMO Highways',
    clientType: 'PE',               // PE | SPORTS | TECH
    engagementLead: 'Dan Robathan',

    // Notion IDs — find these in the URL of each page / database in Notion
    notionGsiPageId:      '3278480d505b808bbf4ae3a391dc413c',
    notionDecisionsDbId:  process.env.NOTION_DECISIONS_DB_ID,
    notionActionsDbId:    process.env.NOTION_ACTIONS_DB_ID,
    notionHistoryDbId:    process.env.NOTION_ASSESSMENT_HISTORY_DB_ID,
  },

  // ── ADD NEW CLIENTS BELOW ──────────────────────────────────────────────────
  //
  // 'client-slug': {
  //   name: 'Client Name',
  //   clientType: 'PE',
  //   engagementLead: 'Dan Robathan',
  //   notionGsiPageId:     'PASTE_NOTION_PAGE_ID_HERE',
  //   notionDecisionsDbId: 'PASTE_DECISIONS_DB_ID_HERE',
  //   notionActionsDbId:   'PASTE_ACTIONS_DB_ID_HERE',
  //   notionHistoryDbId:   'PASTE_HISTORY_DB_ID_HERE',
  // },

};

/**
 * Look up a client's config by their clientId.
 * Returns null if the clientId doesn't exist in the registry.
 */
export function getClientConfig(clientId) {
  return clients[clientId] ?? null;
}
