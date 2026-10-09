export const site = {
  name: 'Magic Land',
  address: '12, rue Antara, Cité La Gazelle, Tunisie',
  phones: [{ label: '25 482 108', href: 'tel:+21625482108' }, { label: '53 860 323', href: 'tel:+21653860323' }],
  directions: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('12 rue Antara, Cité La Gazelle, Tunisie'),
};
export const navigation = [{ label: 'Accueil', href: '#accueil' }, { label: 'Notre univers', href: '#univers' }, { label: 'Nos activités', href: '#activites' }, { label: 'Galerie', href: '#galerie' }, { label: 'Contact', href: '#contact' }];
export const photos = {
  play: { src: '/images/8613089.jpg', alt: 'Enfants et éducatrice réunis autour d’une activité en classe — photographie d’illustration' },
  create: { src: '/images/8612992.jpg', alt: 'Petites mains fabriquant des fleurs et une fusée en papier coloré — photographie d’illustration' },
  discover: { src: '/images/3933025.jpg', alt: 'Petite fille découvrant une maison miniature en bois — photographie d’illustration' },
  movement: { src: '/images/8613312.jpg', height: 960, alt: 'Trois enfants jouent à tenir en équilibre, les bras levés — photographie d’illustration' },
  stories: { src: '/images/8363042.jpg', alt: 'Trois enfants échangent autour d’une table en classe — photographie d’illustration' },
  together: { src: '/images/8613117.jpg', alt: 'Enfants participant à une activité ensemble — photographie d’illustration' },
};
export type PhotoData = { src: string; alt: string; height?: number };
