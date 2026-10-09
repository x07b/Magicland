'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X, Plus } from 'lucide-react';
import { photos } from '@/lib/site';
import { Eyebrow, Photo, Star } from './ui';
import { Reveal, TextReveal } from './motion';
const items = [photos.create, photos.play, photos.discover, photos.together, photos.movement, photos.stories];
export function GallerySection() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (selected === null) return;
    const modal = dialog.current;
    if (!modal?.open) modal?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const buttons = modal?.querySelectorAll<HTMLButtonElement>('button');
        if (buttons?.length) {
          const first = buttons[0]; const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
      if (event.key === 'ArrowRight') { event.preventDefault(); setSelected(index => index === null ? null : (index + 1) % items.length); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSelected(index => index === null ? null : (index + items.length - 1) % items.length); }
    };
    window.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', keydown); };
  }, [selected]);
  const close = () => { dialog.current?.close(); setSelected(null); opener.current?.focus(); };
  return <section className="gallery-section section" id="galerie"><div className="container">
    <Reveal className="gallery-heading"><div><Eyebrow>La vie à Magic Land</Eyebrow><TextReveal>L’enfance, <span className="underline-yellow">en images.</span></TextReveal></div><Star /></Reveal>
    <div className="gallery-grid">{items.map((photo, index) => <Reveal key={photo.src} className={`gallery-item gallery-item-${index}`} delay={index * 0.035}><button onClick={event => { opener.current = event.currentTarget; setSelected(index); }} aria-label={`Agrandir la photo ${index + 1} : ${photo.alt}`}><Photo photo={photo} sizes="(max-width: 600px) 50vw, 33vw" /><span className="gallery-plus"><Plus size={22} aria-hidden="true" /></span></button></Reveal>)}</div>
    <p className="demo-note">Photographies d’illustration — sélectionnez une image pour la voir en grand.</p>
  </div><dialog ref={dialog} className="lightbox" data-lenis-prevent aria-label="Galerie de photographies d’illustration" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    {selected !== null && <><button className="lightbox-close icon-button" onClick={close} aria-label="Fermer la galerie" autoFocus><X /></button><figure><div className="lightbox-image"><Image src={items[selected].src} alt={items[selected].alt} fill sizes="90vw" /></div><figcaption aria-live="polite">{items[selected].alt}<span>{selected + 1} / {items.length}</span></figcaption></figure><div className="lightbox-controls"><button className="icon-button" onClick={() => setSelected((selected + items.length - 1) % items.length)} aria-label="Photo précédente"><ArrowLeft /></button><button className="icon-button" onClick={() => setSelected((selected + 1) % items.length)} aria-label="Photo suivante"><ArrowRight /></button></div></>}
  </dialog></section>;
}
