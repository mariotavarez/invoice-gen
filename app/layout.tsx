import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'InvoiceGen — Create invoices. Get paid.',
  description: 'A self-hosted invoice generator with a Stripe-inspired UI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f7fb' }}>
        {/* Top Navigation */}
        <nav
          className="no-print"
          style={{
            background: '#1c1e54',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#533afd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="2.5" rx="1" fill="white" />
                  <rect x="2" y="6.5" width="8" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
                  <rect x="2" y="10.5" width="10" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.2px',
                }}
              >
                InvoiceGen
              </span>
            </Link>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[
                { href: '/', label: 'Dashboard' },
                { href: '/invoices', label: 'Invoices' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseOver={() => {}}
                >
                  {label}
                </Link>
              ))}

              <Link
                href="/invoices/new"
                style={{
                  marginLeft: '8px',
                  padding: '7px 16px',
                  background: '#533afd',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                New Invoice
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* Footer */}
        <footer
          className="no-print"
          style={{
            borderTop: '1px solid #e5edf5',
            background: '#fff',
            padding: '20px 24px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '13px', color: '#b0bec5' }}>
            InvoiceGen — Built with Next.js 15 &amp; SQLite
          </span>
        </footer>
      </body>
    </html>
  );
}
