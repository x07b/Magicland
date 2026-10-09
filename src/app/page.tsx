import { Navbar } from '@/components/navbar';
import { MotionProvider } from '@/components/motion';
import { GallerySection } from '@/components/gallery';
import { HeroSection, AboutSection, PhilosophySection, ActivitiesSection, WhyMagicLand, EnrollmentCTA, ContactSection, Footer } from '@/components/sections';
export default function Home() {
  const structuredData = { '@context': 'https://schema.org', '@type': 'Preschool', name: 'Magic Land', description: 'Jardin d’enfants à Cité La Gazelle, Tunisie.', telephone: ['+21625482108', '+21653860323'], address: { '@type': 'PostalAddress', streetAddress: '12, rue Antara', addressLocality: 'Cité La Gazelle', addressCountry: 'TN' }, ...(process.env.NEXT_PUBLIC_SITE_URL ? { url: process.env.NEXT_PUBLIC_SITE_URL } : {}) };
  return <MotionProvider><a className="skip-link" href="#main">Aller au contenu</a><Navbar /><main id="main"><HeroSection /><AboutSection /><PhilosophySection /><ActivitiesSection /><GallerySection /><WhyMagicLand /><EnrollmentCTA /><ContactSection enabled={!!process.env.CONTACT_WEBHOOK_URL?.startsWith('https://') && !!process.env.CONTACT_WEBHOOK_SECRET} /></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /></MotionProvider>;
}
