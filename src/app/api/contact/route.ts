import { NextResponse } from 'next/server';
import { validateContact, type ContactData } from '@/lib/contact';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin && origin !== process.env.NEXT_PUBLIC_SITE_URL) return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Format non valide.' }, { status: 415 });
  let raw: Record<string, unknown>;
  try { const text = await request.text(); if (text.length > 12000) return NextResponse.json({ error: 'Demande trop longue.' }, { status: 413 }); raw = JSON.parse(text); if (!raw || typeof raw !== 'object') throw new Error(); } catch { return NextResponse.json({ error: 'Demande non valide.' }, { status: 400 }); }
  if (raw.website) return NextResponse.json({ error: 'Demande non valide.' }, { status: 400 });
  const data = Object.fromEntries(['name', 'phone', 'email', 'message'].map(key => [key, typeof raw[key] === 'string' ? raw[key].trim() : ''])) as ContactData;
  const errors = validateContact(data);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });
  const endpoint = process.env.CONTACT_WEBHOOK_URL;
  if (!endpoint || !endpoint.startsWith('https://') || !process.env.CONTACT_WEBHOOK_SECRET) return NextResponse.json({ error: 'Envoi non configuré. Appelez le 25 482 108.' }, { status: 503 });
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}` }, body: JSON.stringify(data), signal: AbortSignal.timeout(10000), redirect: 'error' });
    if (!response.ok) throw new Error('Delivery failed');
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'La transmission a échoué. Réessayez ou appelez-nous.' }, { status: 502 }); }
}
