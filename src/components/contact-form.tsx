'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LoaderCircle, Phone } from 'lucide-react';
import { validateContact, type ContactData, type ContactErrors } from '@/lib/contact';
export function ContactForm({ enabled }: { enabled: boolean }) {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'unconfigured'>('idle');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const data = Object.fromEntries(['name', 'phone', 'email', 'message'].map(key => [key, String(values.get(key) || '').trim()])) as ContactData;
    const validation = validateContact(data); setErrors(validation);
    if (Object.keys(validation).length) { setStatus('idle'); (form.elements.namedItem(Object.keys(validation)[0]) as HTMLElement)?.focus(); return; }
    if (!enabled) { setStatus('unconfigured'); return; }
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, website: values.get('website') }) });
      if (!response.ok) throw new Error('Delivery failed');
      setStatus('success'); form.reset();
    } catch { setStatus('error'); }
  }
  const fields = [{ name: 'name', label: 'Nom du parent', placeholder: 'Votre nom', type: 'text', autocomplete: 'name' }, { name: 'phone', label: 'Téléphone', placeholder: 'Votre numéro', type: 'tel', autocomplete: 'tel' }, { name: 'email', label: 'Adresse e-mail', placeholder: 'vous@exemple.com', type: 'email', autocomplete: 'email' }] as const;
  return <form className="contact-form" onSubmit={submit} noValidate><h3>Parlons de votre petit explorateur.</h3><p>Une question, une envie de nous rencontrer ?</p><div className="form-fields">{fields.map(field => <div className={`field field-${field.name}`} key={field.name}><label htmlFor={field.name}>{field.label} <span aria-hidden="true">*</span></label><input id={field.name} name={field.name} type={field.type} autoComplete={field.autocomplete} placeholder={field.placeholder} required maxLength={field.name === 'email' ? 254 : 100} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} />{errors[field.name] && <span className="field-error" id={`${field.name}-error`}>{errors[field.name]}</span>}</div>)}<div className="field field-message"><label htmlFor="message">Votre message <span aria-hidden="true">*</span></label><textarea id="message" name="message" placeholder="J’aimerais en savoir plus sur les inscriptions…" rows={4} required maxLength={3000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Site web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <p className="form-note">{enabled ? 'Vos coordonnées servent uniquement à répondre à votre demande.' : 'L’envoi en ligne sera bientôt disponible. Pour toute inscription, appelez-nous au 25 482 108 ou au 53 860 323.'}</p>
    <button type="submit" className="button" disabled={status === 'sending'}>{status === 'sending' ? <><LoaderCircle className="spin" size={18} />Envoi en cours…</> : <>{enabled ? 'Envoyer ma demande' : 'Vérifier ma demande'}<ArrowUpRight size={18} /></>}</button>
    <div role="status" aria-live="polite" className={`form-status ${status}`}>{status === 'success' && <><CheckCircle2 size={20} />Votre demande a bien été transmise. Merci de votre intérêt !</>}{status === 'error' && <>Votre message n’a pas pu être envoyé. Réessayez ou appelez-nous au <a href="tel:+21625482108">25 482 108</a>.</>}{status === 'unconfigured' && <>Votre demande est complète, mais elle n’a pas été envoyée. Contactez-nous directement : <a href="tel:+21625482108"><Phone size={16} />25 482 108</a>.</>}</div>
  </form>;
}
