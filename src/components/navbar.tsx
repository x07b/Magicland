'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { navigation } from '@/lib/site';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    const resize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('keydown', close); window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, []);
  return <header className="header"><div className="nav-shell">
    <a className="logo-link" href="#accueil" aria-label="Magic Land, accueil"><Image src="/brand/magic-land.jpg" alt="Magic Land — Jardin d’enfants, pour un avenir brillant" width={92} height={92} priority /><span className="logo-descriptor">JARDIN D’ENFANTS<br /><span>Cité La Gazelle</span></span></a>
    <nav className="desktop-nav" aria-label="Navigation principale">{navigation.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <a href="#inscription" className="button nav-cta">Inscrire mon enfant <ArrowUpRight size={17} aria-hidden="true" /></a>
    <button ref={trigger} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>{open ? <X /> : <Menu />}</button>
  </div><AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-nav" aria-label="Navigation mobile" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>{navigation.map((link, index) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}<ArrowUpRight size={20} /></a>)}<a href="#inscription" onClick={() => setOpen(false)}>Inscrire mon enfant <ArrowUpRight size={20} /></a></motion.nav>}</AnimatePresence></header>;
}
