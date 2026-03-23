/**
 * Valens Intelligence — Terminology Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Change CLIENT_TYPE in your .env to switch the entire dashboard's language.
 *
 * CLIENT_TYPE options:
 *   PE      → Private Equity / Investment Committee language
 *   SPORTS  → Sporting organisations / Board Committee language
 *   TECH    → Tech / Fintech / Startup language
 *
 * To add a new client type, duplicate one of the blocks below and update labels.
 */

const TERMINOLOGY = {
  PE: {
    decisionRegisterTitle: 'IC Memo Register',
    decisionRegisterSub:   'Decision Quality (DQ) scoring across all Investment Committee submissions',
    decisionLabel:         'Decision',
    committeeName:         'Investment Committee',
    committeeAbbr:         'IC',
    memoLabel:             'IC Memo',
    stageLabel:            'Stage',
    ownerLabel:            'Sponsor',
    returnLabel:           'Return to IC',
    approvedLabel:         'Approved',
    conditionalLabel:      'Conditional',
  },

  SPORTS: {
    decisionRegisterTitle: 'Committee Resolution Register',
    decisionRegisterSub:   'Decision Quality (DQ) scoring across all Board Committee resolutions',
    decisionLabel:         'Resolution',
    committeeName:         'Board Committee',
    committeeAbbr:         'BC',
    memoLabel:             'Committee Document',
    stageLabel:            'Stage',
    ownerLabel:            'Lead Director',
    returnLabel:           'Defer',
    approvedLabel:         'Ratified',
    conditionalLabel:      'Pending Review',
  },

  TECH: {
    decisionRegisterTitle: 'Committee Document Register',
    decisionRegisterSub:   'Decision Quality (DQ) scoring across all Committee submissions',
    decisionLabel:         'Decision',
    committeeName:         'Executive Committee',
    committeeAbbr:         'EC',
    memoLabel:             'Committee Document',
    stageLabel:            'Stage',
    ownerLabel:            'DRI',
    returnLabel:           'Return for Revision',
    approvedLabel:         'Approved',
    conditionalLabel:      'Conditional Approval',
  },
};

/**
 * Returns the terminology object for the given client type.
 * Falls back to PE if an unrecognised type is supplied.
 *
 * @param {string} clientType - 'PE' | 'SPORTS' | 'TECH'
 * @returns {object}
 */
export function getTerminology(clientType = 'PE') {
  return TERMINOLOGY[clientType] ?? TERMINOLOGY.PE;
}

export default TERMINOLOGY;
