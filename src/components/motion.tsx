'use client';
import { Children, cloneElement, isValidElement, useEffect, type ReactNode } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    const configure = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!preference.matches) lenis = new Lenis({
        autoRaf: true, smoothWheel: true, syncTouch: false, lerp: 0.085,
        anchors: false,
        prevent: node => node.tagName === 'DIALOG' || node.tagName === 'TEXTAREA',
      });
    };
    configure();
    const navigate = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      // Read the actual position, including any native keyboard/touch scrolling.
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const destination = target.getBoundingClientRect().top + window.scrollY - padding - margin;
      lenis.scrollTo(destination, { duration: 1.15, lerp: 0, onComplete: () => {
        const hadTabIndex = target.hasAttribute('tabindex');
        if (!hadTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      } });
    };
    document.addEventListener('click', navigate);
    // Stop any wheel momentum while the native gallery dialog is open.
    const observer = new MutationObserver(() => {
      if (document.querySelector('dialog[open]')) lenis?.stop();
      else lenis?.start();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    preference.addEventListener('change', configure);
    return () => { document.removeEventListener('click', navigate); observer.disconnect(); preference.removeEventListener('change', configure); lenis?.destroy(); };
  }, []);
  return null;
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user"><SmoothScroll />{children}</MotionConfig>;
}
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { opacity: [0, 1] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

/** Preserve semantic headings, original line breaks and accent artwork. */
export function TextReveal({ children, as = 'h2' }: { children: ReactNode; as?: 'h1' | 'h2' }) {
  const reduced = useReducedMotion();
  let wordIndex = 0;
  const words = (nodes: ReactNode): ReactNode => Children.map(nodes, node => {
    if (typeof node === 'string') return node.split(/([ \t\n]+)/).map((word, index) => {
      if (!word.trim()) return word;
      const delay = Math.min(wordIndex++ * 0.045, 0.5);
      return <motion.span key={index} className="reveal-word" variants={{ visible: reduced ? {} : { opacity: [0, 1], y: [12, 0], transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } } }}>{word}</motion.span>;
    });
    if (isValidElement<{ children?: ReactNode }>(node) && node.type === 'span') return cloneElement(node, {}, words(node.props.children));
    return node;
  });
  const Heading = as === 'h1' ? motion.h1 : motion.h2;
  return <Heading initial={false} whileInView="visible" viewport={{ once: true, amount: 0.5 }}>{words(children)}</Heading>;
}
