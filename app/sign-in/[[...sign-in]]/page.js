'use client';
import { SignIn } from '@clerk/nextjs';
export default function SignInPage() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--navy)', padding:'40px 20px' }}>
      <div style={{ marginBottom:'40px', textAlign:'center' }}>
        <img src="/logo.svg" alt="Valens" style={{ height:'56px', display:'block', margin:'0 auto 14px' }} />
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'18px', fontWeight:500, letterSpacing:'0.14em', color:'var(--white)', textTransform:'uppercase' }}>
          Valens Intelligence
        </div>
        <div style={{ fontSize:'12px', color:'var(--text-secondary)', letterSpacing:'0.10em', marginTop:'4px' }}>
          Secure access — authorised personnel only
        </div>
      </div>
      <SignIn
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        appearance={{
          variables: { colorPrimary:'#C6A75E', colorBackground:'rgba(18,58,111,0.30)', colorText:'rgba(255,255,255,0.92)', colorTextSecondary:'rgba(255,255,255,0.55)', colorInputBackground:'rgba(255,255,255,0.06)', colorInputText:'rgba(255,255,255,0.92)', fontFamily:'Inter, system-ui, sans-serif', borderRadius:'4px' },
          elements: { card:{ background:'rgba(18,58,111,0.30)', border:'1px solid rgba(198,167,94,0.18)', boxShadow:'none' }, formButtonPrimary:{ background:'#C6A75E', color:'#0B1C2D', fontWeight:600 } }
        }}
      />
      <div style={{ marginTop:'48px', fontSize:'11px', color:'var(--text-muted)', textAlign:'center' }}>
        intelligence.valensadvisory.co.uk · © 2026 Valens Advisory
      </div>
    </div>
  );
}
