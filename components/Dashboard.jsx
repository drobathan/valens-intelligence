'use client';

import { UserButton } from '@clerk/nextjs';
import TrendChart from './TrendChart';

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function dqClass(score) {
  const n = parseInt(score, 10);
  if (n >= 80) return 'dq-approved';
  if (n >= 60) return 'dq-conditional';
  return 'dq-return';
}

function dqStatusLabel(score, term) {
  const n = parseInt(score, 10);
  if (n >= 80) return term.approvedLabel;
  if (n >= 60) return term.conditionalLabel;
  return term.returnLabel;
}

function actionStatusClass(status) {
  const s = (status ?? '').toLowerCase();
  if (s.includes('progress')) return 'status-progress';
  if (s.includes('overdue') || s.includes('late')) return 'status-overdue';
  return 'status-open';
}

// ── Inline styles object ──────────────────────────────────────────────────────
const s = {
  // Layout
  wrap: { maxWidth: '1280px', margin: '0 auto', padding: '0 40px' },
  goldRule: {
    width: '100%', height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, #C6A75E 20%, #C6A75E 80%, transparent 100%)',
    opacity: 0.45,
  },
  section: { padding: '56px 0' },
  sectionNoPad: { padding: '0 0 56px' },

  // Header
  header: {
    background: 'rgba(11,28,45,0.98)',
    borderBottom: '1px solid rgba(198,167,94,0.18)',
    position: 'sticky', top: 0, zIndex: 100,
    backdropFilter: 'blur(12px)',
  },
  headerInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '64px', maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
  },
  logoLockup: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoWordmark: {
    fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 500,
    letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase',
  },
  logoDivider: { width: '1px', height: '22px', background: 'rgba(198,167,94,0.40)' },
  logoSub: {
    fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 400,
    letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
  },
  headerMeta: { display: 'flex', alignItems: 'center', gap: '28px' },
  metaItem: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' },
  metaLabel: {
    fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
  },
  metaValue: { fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.55)' },
  metaValueGold: { fontSize: '12px', fontWeight: 500, color: '#C6A75E' },
  confBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '4px 12px', border: '1px solid rgba(198,167,94,0.40)',
    borderRadius: '2px', fontSize: '10px', fontWeight: 600,
    letterSpacing: '0.20em', color: '#C6A75E', textTransform: 'uppercase',
  },

  // Hero
  hero: { padding: '72px 0 56px' },
  heroGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' },
  eyebrow: {
    fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em',
    color: '#C6A75E', textTransform: 'uppercase', marginBottom: '8px',
  },
  heroScoreWrap: { display: 'flex', alignItems: 'flex-start', gap: '32px' },
  scoreDetail: { paddingTop: '8px', flex: 1 },
  heroTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 500,
    color: '#FFFFFF', lineHeight: 1.25, marginBottom: '16px',
  },
  stabilityBand: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 14px', background: 'rgba(74,158,107,0.12)',
    border: '1px solid rgba(74,158,107,0.35)', borderRadius: '2px', marginBottom: '16px',
  },
  bandLabel: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', color: '#4A9E6B', textTransform: 'uppercase' },
  heroThesis: { fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '400px' },
  heroRight: { display: 'flex', flexDirection: 'column', gap: '24px' },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  statCard: {
    background: 'rgba(18,58,111,0.30)', border: '1px solid rgba(198,167,94,0.18)',
    borderRadius: '4px', padding: '20px 16px',
  },
  statLabel: { fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '8px' },
  statVal: { fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 500, color: '#FFFFFF' },
  statSub: { fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' },
  assessmentMeta: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  ametaItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  ametaLabel: { fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' },
  ametaValue: { fontSize: '13px', color: 'rgba(255,255,255,0.55)' },

  // Section headers
  sectionHeader: { marginBottom: '36px' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' },
  sectionSub: { fontSize: '13px', color: 'rgba(255,255,255,0.55)' },

  // Pillar grid
  pillarGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  pillarCard: {
    background: 'rgba(18,58,111,0.30)', border: '1px solid rgba(198,167,94,0.18)',
    borderRadius: '4px', padding: '24px 20px', position: 'relative', overflow: 'hidden',
  },
  pillarCardExposed: {
    background: 'rgba(196,148,74,0.06)', border: '1px solid rgba(196,148,74,0.55)',
    borderRadius: '4px', padding: '24px 20px', position: 'relative', overflow: 'hidden',
  },
  pillarName: { fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginBottom: '16px', paddingRight: '0', lineHeight: 1.4 },
  pillarNameExposed: { fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.92)', marginBottom: '16px', lineHeight: 1.4 },
  pillarScoreRow: { display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' },
  pillarScore: { fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1 },
  pillarMax: { fontSize: '13px', color: 'rgba(255,255,255,0.35)' },
  pillarWeight: { marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.35)' },
  pillarBarBg: { height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' },

  // Chart
  chartCard: {
    background: 'rgba(18,58,111,0.30)', border: '1px solid rgba(198,167,94,0.18)',
    borderRadius: '8px', padding: '32px 32px 24px',
  },
  chartHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' },

  // Table
  tableWrap: {
    background: 'rgba(18,58,111,0.30)', border: '1px solid rgba(198,167,94,0.18)',
    borderRadius: '8px', overflow: 'hidden',
  },

  // Footer
  footer: { borderTop: '1px solid rgba(198,167,94,0.18)', padding: '32px 0' },
  footerInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
  },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
  footerLogoText: {
    fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 500,
    letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
  },
  footerUrl: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' },
  footerDisclaimer: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', maxWidth: '420px', textAlign: 'right' },
};

// ── VA Logo ───────────────────────────────────────────────────────────────────
// Uses /public/logo.svg by default.
// To use your exact brand logo: upload your logo file to the GitHub `public/`
// folder as `logo.png` (or `logo.svg`) and update the src below.
function VALogo({ size = 36 }) {
  return (
    <img
      src="/logo.svg"
      alt="Valens Advisory"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  );
}

// ── Score Circle ──────────────────────────────────────────────────────────────
function ScoreCircle({ score }) {
  const r = 58;
  const circ = 2 * Math.PI * r; // ≈ 364.4
  const fill = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
        <circle cx="70" cy="70" r={r} fill="none"
          stroke="#C6A75E" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ - fill}`}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>/ 100</span>
      </div>
    </div>
  );
}

// ── DQ Badge ──────────────────────────────────────────────────────────────────
function DQBadge({ score }) {
  const n = parseInt(score, 10);
  const color  = n >= 80 ? '#4A9E6B' : n >= 60 ? '#C4944A' : '#C45C5C';
  const bg     = n >= 80 ? 'rgba(74,158,107,0.15)' : n >= 60 ? 'rgba(196,148,74,0.15)' : 'rgba(196,92,92,0.15)';
  const border = n >= 80 ? 'rgba(74,158,107,0.25)' : n >= 60 ? 'rgba(196,148,74,0.25)' : 'rgba(196,92,92,0.25)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 26, borderRadius: 2, fontSize: 12, fontWeight: 600, background: bg, color, border: `1px solid ${border}` }}>
      {score ?? '—'}
    </span>
  );
}

// ── Status Chip ───────────────────────────────────────────────────────────────
function StatusChip({ label }) {
  const l = (label ?? '').toLowerCase();
  let color, bg;
  if (l.includes('approv') || l.includes('ratif')) {
    color = '#4A9E6B'; bg = 'rgba(74,158,107,0.12)';
  } else if (l.includes('conditional') || l.includes('pending') || l.includes('review')) {
    color = '#C4944A'; bg = 'rgba(196,148,74,0.12)';
  } else {
    color = '#C45C5C'; bg = 'rgba(196,92,92,0.12)';
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 2, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color, background: bg }}>
      {label}
    </span>
  );
}

// ── Action Status Chip ────────────────────────────────────────────────────────
function ActionChip({ status }) {
  const s = (status ?? '').toLowerCase();
  let color, bg, border = 'transparent';
  if (s.includes('progress')) {
    color = 'rgba(100,150,220,0.9)'; bg = 'rgba(18,58,111,0.40)'; border = 'rgba(100,150,220,0.20)';
  } else if (s.includes('overdue') || s.includes('late')) {
    color = '#C45C5C'; bg = 'rgba(196,92,92,0.12)';
  } else {
    color = '#C6A75E'; bg = 'rgba(198,167,94,0.12)';
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 2, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color, background: bg, border: `1px solid ${border}` }}>
      {status}
    </span>
  );
}

// ── Pillar Card ───────────────────────────────────────────────────────────────
function PillarCard({ pillar, isExposed }) {
  const pct = Math.round((pillar.score / pillar.max) * 100);
  const barColor = isExposed ? '#C4944A' : '#C6A75E';
  return (
    <div style={isExposed ? s.pillarCardExposed : s.pillarCard}>
      {isExposed && (
        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: '#C4944A', opacity: 0.85, textTransform: 'uppercase' }}>
          Primary Exposure
        </div>
      )}
      <div style={isExposed ? s.pillarNameExposed : s.pillarName}>{pillar.name}</div>
      <div style={s.pillarScoreRow}>
        <span style={s.pillarScore}>{pillar.score}</span>
        <span style={s.pillarMax}>/ {pillar.max}</span>
        <span style={s.pillarWeight}>{pillar.weight}</span>
      </div>
      <div style={s.pillarBarBg}>
        <div style={{ height: '100%', borderRadius: 2, background: barColor, width: `${pct}%` }}/>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ──────────────────────────────────────────────────
export default function Dashboard({ data, terminology }) {
  const { scorecard, decisions, openActions, assessmentHistory, meta } = data;

  // Find exposed pillar (lowest pct)
  const withPct = scorecard.pillars.map((p) => ({ ...p, pct: p.score / p.max }));
  const minPct = Math.min(...withPct.map((p) => p.pct));
  const exposedIndex = withPct.findIndex((p) => p.pct === minPct);

  // Compute trend
  const baseline = assessmentHistory[0]?.score ?? scorecard.score;
  const trendDelta = scorecard.score - baseline;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoLockup}>
            <VALogo size={36}/>
            <span style={s.logoWordmark}>Valens</span>
            <div style={s.logoDivider}/>
            <span style={s.logoSub}>Intelligence</span>
          </div>
          <div style={s.headerMeta}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Client</span>
              <span style={s.metaValue}>{meta.clientName}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Engagement Lead</span>
              <span style={s.metaValueGold}>{meta.engagementLead}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Ref</span>
              <span style={s.metaValue}>{meta.engagementId}</span>
            </div>
            <div style={s.confBadge}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C6A75E' }}/>
              High Confidentiality
            </div>
            <UserButton afterSignOutUrl="/sign-in"/>
          </div>
        </div>
      </header>

      <main>
        <div style={s.wrap}>

          {/* ── HERO ─────────────────────────────────────── */}
          <section style={s.hero}>
            <div style={s.heroGrid}>
              {/* Left */}
              <div>
                <p style={s.eyebrow}>Governance Stability Index</p>
                <div style={s.heroScoreWrap}>
                  <ScoreCircle score={scorecard.score}/>
                  <div style={s.scoreDetail}>
                    <h1 style={s.heroTitle}>Governance<br/>{scorecard.stabilityBand.charAt(0).toUpperCase() + scorecard.stabilityBand.slice(1)}</h1>
                    <div style={s.stabilityBand}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A9E6B' }}/>
                      <span style={s.bandLabel}>{scorecard.stabilityBand} Band</span>
                    </div>
                    <p style={s.heroThesis}>
                      Board composition and operational governance performing at full score.
                      Primary exposure remains{' '}
                      <span style={{ color: '#C4944A', fontWeight: 500 }}>
                        {scorecard.pillars[exposedIndex]?.name ?? scorecard.primaryExposure}
                      </span>{' '}
                      — structural attention advised.
                    </p>
                  </div>
                </div>
              </div>
              {/* Right */}
              <div style={s.heroRight}>
                <div style={s.statRow}>
                  <div style={s.statCard}>
                    <div style={s.statLabel}>Decisions Logged</div>
                    <div style={s.statVal}>{decisions.length}</div>
                    <div style={s.statSub}>This engagement</div>
                  </div>
                  <div style={s.statCard}>
                    <div style={s.statLabel}>Open Actions</div>
                    <div style={s.statVal}>{openActions.length}</div>
                    <div style={s.statSub}>Requiring attention</div>
                  </div>
                  <div style={s.statCard}>
                    <div style={s.statLabel}>Trend</div>
                    <div style={s.statVal}>{trendDelta >= 0 ? '↑' : '↓'} {Math.abs(trendDelta)}</div>
                    <div style={s.statSub}>vs {formatDate(assessmentHistory[0]?.date).replace(/\d+ /, '')}</div>
                  </div>
                </div>
                <div style={s.assessmentMeta}>
                  <div style={s.ametaItem}>
                    <span style={s.ametaLabel}>Assessment Date</span>
                    <span style={s.ametaValue}>{formatDate(scorecard.assessmentDate)}</span>
                  </div>
                  <div style={s.ametaItem}>
                    <span style={s.ametaLabel}>Engagement ID</span>
                    <span style={s.ametaValue}>{meta.engagementId}</span>
                  </div>
                  <div style={s.ametaItem}>
                    <span style={s.ametaLabel}>Executive Thesis</span>
                    <span style={{ ...s.ametaValue, color: '#4A9E6B' }}>{scorecard.executiveThesis}</span>
                  </div>
                  <div style={s.ametaItem}>
                    <span style={s.ametaLabel}>Primary Exposure</span>
                    <span style={{ ...s.ametaValue, color: '#C4944A' }}>{scorecard.primaryExposure}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div style={s.goldRule}/>

          {/* ── PILLAR BREAKDOWN ──────────────────────────── */}
          <section style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Pillar Breakdown</h2>
              <p style={s.sectionSub}>Six dimensions of institutional governance, weighted by materiality</p>
            </div>
            <div style={s.pillarGrid}>
              {scorecard.pillars.map((pillar, i) => (
                <PillarCard key={i} pillar={pillar} isExposed={i === exposedIndex}/>
              ))}
            </div>
          </section>

          <div style={s.goldRule}/>

          {/* ── ASSESSMENT TREND ──────────────────────────── */}
          <section style={s.sectionNoPad}>
            <div style={s.chartCard}>
              <div style={s.chartHeader}>
                <div>
                  <h2 style={{ ...s.sectionTitle, marginBottom: 4 }}>GSI Trend</h2>
                  <p style={{ ...s.sectionSub, margin: 0 }}>Governance Stability Index — rolling assessment history</p>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                    <div style={{ width: 8, height: 3, borderRadius: 2, background: '#C6A75E' }}/>
                    GSI Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                    <div style={{ width: 8, height: 0, borderTop: '1px dashed rgba(255,255,255,0.25)' }}/>
                    Stability threshold (75)
                  </div>
                </div>
              </div>
              <TrendChart history={assessmentHistory}/>
            </div>
          </section>

          <div style={{ ...s.goldRule, margin: '56px 0 0' }}/>

          {/* ── DECISION REGISTER ─────────────────────────── */}
          <section style={s.sectionNoPad}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>{terminology.decisionRegisterTitle}</h2>
              <p style={s.sectionSub}>{terminology.decisionRegisterSub}</p>
            </div>
            <div style={s.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.18)' }}>
                    {['Ref', 'Decision', terminology.stageLabel, 'DQ Score', 'Status', `${terminology.committeeAbbr} Date`, terminology.ownerLabel].map((h) => (
                      <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {decisions.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '24px 20px', fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>No decisions logged yet.</td></tr>
                  )}
                  {decisions.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(198,167,94,0.07)' }}>
                      <td style={{ padding: '16px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', color: '#C6A75E' }}>{d.ref}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.92)', maxWidth: 340 }}>{d.decision}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{d.stage}</td>
                      <td style={{ padding: '16px 20px' }}><DQBadge score={d.dqScore}/></td>
                      <td style={{ padding: '16px 20px' }}><StatusChip label={d.status}/></td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>{formatDate(d.icDate)}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{d.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              DQ Key: &nbsp;
              <span style={{ color: '#4A9E6B' }}>■ 80–100 {terminology.approvedLabel}</span> &nbsp;
              <span style={{ color: '#C4944A' }}>■ 60–79 {terminology.conditionalLabel}</span> &nbsp;
              <span style={{ color: '#C45C5C' }}>■ Below 60 {terminology.returnLabel}</span>
            </p>
          </section>

          <div style={{ ...s.goldRule, margin: '56px 0 0' }}/>

          {/* ── OPEN ACTIONS ──────────────────────────────── */}
          <section style={s.sectionNoPad}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <h2 style={{ ...s.sectionTitle, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  Open Actions
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(198,167,94,0.15)', border: '1px solid rgba(198,167,94,0.40)', fontSize: 11, fontWeight: 600, color: '#C6A75E' }}>{openActions.length}</span>
                </h2>
                <p style={{ ...s.sectionSub, marginTop: 6 }}>Live from Action Register — requires resolution before next assessment</p>
              </div>
            </div>
            <div style={s.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(198,167,94,0.18)' }}>
                    {['Action', 'Owner', 'Due Date', 'Status'].map((h) => (
                      <th key={h} style={{ padding: '14px 20px', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {openActions.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '24px 20px', fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>No open actions. All clear.</td></tr>
                  )}
                  {openActions.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(198,167,94,0.07)' }}>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.92)' }}>{a.actionName}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>—</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>{formatDate(a.dueDate)}</td>
                      <td style={{ padding: '16px 20px' }}><ActionChip status={a.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <VALogo size={24}/>
            <span style={s.footerLogoText}>Valens Advisory</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={s.footerUrl}>intelligence.valensadvisory.co.uk</div>
            <div style={s.footerDisclaimer}>This dashboard contains confidential governance intelligence. Distribution or reproduction is strictly prohibited. © 2026 Valens Advisory.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
