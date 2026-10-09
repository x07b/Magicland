import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { PhotoData } from '@/lib/site';

export function Photo({ photo, className = '', priority = false, sizes = '(max-width: 767px) 90vw, 45vw' }: { photo: PhotoData; className?: string; priority?: boolean; sizes?: string }) {
  return <div className={`photo ${className}`} style={{ aspectRatio: `1200 / ${photo.height ?? 800}` }}><Image src={photo.src} alt={photo.alt} width={1200} height={photo.height ?? 800} sizes={sizes} priority={priority} /></div>;
}
export function Button({ children, href, variant = '', className = '' }: { children: React.ReactNode; href: string; variant?: string; className?: string }) {
  return <a className={`button ${variant} ${className}`} href={href}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}
export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'light' : ''}`}><span aria-hidden="true" />{children}</p>;
}
export function Star({ className = '' }: { className?: string }) {
  return <svg className={`star ${className}`} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="m50 1 12 31 34-4-22 26 14 31-32-13-27 23 3-35L2 44l34-8Z" /></svg>;
}
export function Flower({ className = '' }: { className?: string }) {
  return <svg className={`flower ${className}`} viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 19C75-16 101 17 81 38c41 5 22 48-5 40-3 41-47 26-43 0C-7 90-9 45 19 38-2 6 34-10 50 19Z"/><path d="M36 48v6m23-6v6M37 65q12 12 24-2" fill="none" stroke="#082c59" strokeWidth="4" strokeLinecap="round" /></svg>;
}
export function Scribble({ className = '' }: { className?: string }) {
  return <svg className={`scribble ${className}`} viewBox="0 0 150 90" fill="none" aria-hidden="true"><path d="M4 76C63 74 103 16 80 6 51-7 33 50 64 52 87 54 121 24 140 12m-19 0 20-2-1 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
