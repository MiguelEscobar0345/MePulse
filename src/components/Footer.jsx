import React from 'react'

const LINKS = {
  sitemap: [
    { label: 'Portfolio',  href: 'https://portfolio.com' },
    { label: 'Contact',    href: 'mailto:miguelescobarp03@gmail.com' },
  ],
  socials: [
    { label: 'LinkedIn',   href: 'https://www.linkedin.com/in/miguel-escobar-p ' },
    { label: 'GitHub',     href: 'https://github.com/MiguelEscobar0345' },
    { label: 'Instagram',  href: 'https://www.instagram.com/escomiguep?igsh=Njl4bWpnOXB3NTJ1&utm_source=qr' },
    { label: 'Email',      href: 'mailto:miguelescobarp03@gmail.com' },
  ],
}

export default function Footer() {
  return (
    <>
      <style>{`
        .f-link { text-decoration:none; color:var(--text-3); font-size:0.9rem; line-height:2.2; display:block; transition:color 0.15s; }
        .f-link:hover { color:var(--gain); }
        @media(max-width:640px){
          .f-cols{flex-direction:column!important;gap:28px!important;}
          .f-bottom{flex-direction:column!important;gap:16px!important;align-items:flex-start!important;}
          .f-name{font-size:2rem!important;}
        }
      `}</style>
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-1)',
        padding: '44px 40px 36px',
        boxSizing: 'border-box',
        marginTop: 'auto',
      }}>
        <div className="f-cols" style={{ display:'flex', justifyContent:'space-between', gap:40, marginBottom:44 }}>
          <div>
            <div style={{ fontSize:'0.62rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)', marginBottom:10 }}>Sitemap</div>
            {LINKS.sitemap.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="f-link">{l.label}</a>)}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'0.62rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)', marginBottom:10 }}>Socials</div>
            {LINKS.socials.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="f-link">{l.label}</a>)}
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--border)', marginBottom:32 }} />
        <div className="f-bottom" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <h2 className="f-name" style={{
            fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.8rem)',
            fontWeight:900, letterSpacing:'-0.04em', lineHeight:1.05, color:'var(--text-1)',
          }}>
            Miguel E.<br />Escobar P.
          </h2>
          <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'0.6rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)' }}>Version</div>
              <div style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-1)', fontFamily:'var(--font-mono)' }}>2026</div>
            </div>
            <img src="/macaw.png" alt="Macaw" style={{ width:40, height:40, objectFit:'contain', opacity:0.7 }} onError={e => { e.target.style.display='none' }} />
          </div>
        </div>
      </footer>
    </>
  )
}