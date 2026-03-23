'use client';

import { SignIn } from '@clerk/nextjs';

/**
 * Sign-in page — Clerk handles the full auth flow.
 * Styled to match Valens brand via globals.css Clerk overrides.
 */
export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--navy)',
        padding: '40px 20px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <svg
          width="48"
          height="42"
          viewBox="0 0 52 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', margin: '0 auto 14px' }}
        >
          <polyline
            points="2,4 13,38 24,12"
            stroke="#C6A75E"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <polyline
            points="28,12 39,38 50,4"
            stroke="#C6A75E"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: 'var(--white)',
            textTransform: 'uppercase',
          }}
        >
          Valens Intelligence
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.10em',
            marginTop: '4px',
          }}
        >
          Secure access — authorised personnel only
        </div>
      </div>

      {/* Clerk Sign In Component */}
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#C6A75E',
            colorBackground: 'rgba(18,58,111,0.30)',
            colorText: 'rgba(255,255,255,0.92)',
            colorTextSecondary: 'rgba(255,255,255,0.55)',
            colorInputBackground: 'rgba(255,255,255,0.06)',
            colorInputText: 'rgba(255,255,255,0.92)',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '4px',
          },
          elements: {
            card: {
              background: 'rgba(18,58,111,0.30)',
              border: '1px solid rgba(198,167,94,0.18)',
              boxShadow: 'none',
            },
            formButtonPrimary: {
              background: '#C6A75E',
              color: '#0B1C2D',
              fontWeight: 600,
            },
          },
        }}
      />

      <div
        style={{
          marginTop: '48px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        intelligence.valensadvisory.co.uk · © 2026 Valens Advisory
      </div>
    </div>
  );
}
