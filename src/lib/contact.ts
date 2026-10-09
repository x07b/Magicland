export type ContactData = { name: string; phone: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;
export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.trim().length < 2 || data.name.length > 100) errors.name = 'Indiquez votre nom (2 à 100 caractères).';
  const digits = data.phone.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(data.phone) || digits.length < 8 || digits.length > 15) errors.phone = 'Indiquez un numéro valide, par exemple 25 482 108.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254) errors.email = 'Indiquez une adresse e-mail valide.';
  if (data.message.trim().length < 10 || data.message.length > 3000) errors.message = 'Écrivez un message de 10 à 3 000 caractères.';
  return errors;
}
