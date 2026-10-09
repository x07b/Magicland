import type { Metadata } from 'next';
import { Fredoka, DM_Sans } from 'next/font/google';
import './globals.css';

const heading = Fredoka({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const title = "Magic Land | Jardin d'Enfants à Cité La Gazelle";
const description = 'Découvrez Magic Land, jardin d’enfants à Cité La Gazelle. Un espace chaleureux pour jouer, explorer et grandir. Inscriptions 2026/2027 ouvertes.';
export const metadata: Metadata = {
  title, description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { alternates: { canonical: '/' } } : {}),
  openGraph: { title, description, locale: 'fr_TN', type: 'website', siteName: 'Magic Land', images: [{ url: '/brand/magic-land.jpg', width: 1254, height: 1254, alt: 'Magic Land — Jardin d’enfants' }] },
  twitter: { card: 'summary', title, description, images: ['/brand/magic-land.jpg'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${heading.variable} ${body.variable}`}>{children}</body></html>;
}
