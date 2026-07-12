export type Genre = 'Fiction' | 'Memoir' | 'Devotional';

export interface Book {
  id: string;
  title: string;
  titleHtml?: string; // for mixed-color titles
  author: string;
  tagline: string;
  synopsis: string;
  genre: Genre;
  isHindi?: boolean;
  gradient: string; // tailwind gradient classes
  textOnDark?: boolean;
  bookWebsite?: string; // external
  buyLinks: { label: string; href: string }[];
}

export const books: Book[] = [
  {
    id: 'offbeat-love',
    title: 'Offbeat Love',
    author: 'Gaurav Mishra',
    tagline: 'Two Worlds, One Melody',
    synopsis:
      'A heartfelt romance about love, music, family expectations, and the courage to break free from a golden cage. Set against the pulse of Mumbai, it follows two souls from different worlds who find one shared melody.',
    genre: 'Fiction',
    gradient: 'from-ink via-rose to-amber-400',
    textOnDark: true,
    bookWebsite: 'https://off-beat-love.com',
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
  {
    id: 'anootha-pyar',
    title: 'अनूठा प्यार',
    author: 'गौरव मिश्रा',
    tagline: 'दो दुनियाएँ, एक धुन',
    synopsis:
      'अनूठा प्यार एक हृदयस्पर्शी प्रेम कथा है — प्यार, संगीत, परिवार की उम्मीदों और सुनहरे पिंजरे से आज़ादी के साहस की। मुंबई की धड़कनों के बीच दो अलग दुनियाओं से आते हुए भी एक धुन को पाने वाली कहानी।',
    genre: 'Fiction',
    isHindi: true,
    gradient: 'from-ink via-rose to-amber-400',
    textOnDark: true,
    bookWebsite: 'https://off-beat-love.com',
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
  {
    id: 'shadow-code',
    title: 'Shadow Code',
    titleHtml: '<span class="text-slate-200">SHADOW</span> <span class="text-gold-lt">CODE</span>',
    author: 'Gaurav Mishra',
    tagline: 'In a world of algorithms and lies, the truth hides in the shadows.',
    synopsis:
      'A taut techno-thriller that moves between Mumbai’s financial district and the dark architecture of the internet. When a whistleblower uncovers a pattern buried in code, the chase that follows blurs the line between watcher and watched.',
    genre: 'Fiction',
    gradient: 'from-[#0a1424] via-[#0e1a2b] to-[#16243a]',
    textOnDark: true,
    bookWebsite: 'https://the-shadow-code.com',
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
  {
    id: 'journey-of-grace',
    title: 'A Journey of Grace',
    author: 'Gaurav Mishra',
    tagline: 'A Travel Memoir of Faith, Discovery & Divine Connections.',
    synopsis:
      'A reflective travel memoir that traces a journey across sacred landscapes and quiet roadside towns — a search for meaning, for the divine in the everyday, and for the grace that travels with us when we finally learn to listen.',
    genre: 'Memoir',
    gradient: 'from-amber-200 via-gold-lt to-cream',
    textOnDark: false,
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
  {
    id: 'vishnu-sahasranama',
    title: 'श्री विष्णु सहस्रनामः',
    author: 'गौरव मिश्रा',
    tagline: 'सरल अर्थ, भावार्थ और दैनिक जीवन में प्रयोग',
    synopsis:
      'भगवान विष्णु के हजार नामों का सरल, भावपूर्ण अर्थ और भावार्थ — युवाओं और आधुनिक पाठकों के लिए, ताकि भक्ति केवल पठन तक सीमित न रहे, बल्कि दैनिक जीवन का हिस्सा बन जाए।',
    genre: 'Devotional',
    gradient: 'from-[#0d1b46] via-[#10245e] to-[#0a1438]',
    textOnDark: true,
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
  {
    id: 'lalita-sahasranama',
    title: 'श्री ललितासहस्रनाम',
    author: 'गौरव मिश्रा',
    tagline: 'सरल अर्थ, भावार्थ और दैनिक जीवन में प्रयोग',
    synopsis:
      'दिव्य माता ललिता के हजार नामों का सरल अर्थ और भावार्थ। एक ऐसा प्रयास जो शास्त्रीय ज्ञान को आज की भाषा में रखता है, ताकि भक्ति और ज्ञान दोनों साथ चलें।',
    genre: 'Devotional',
    gradient: 'from-[#3a0d1a] via-[#5a1026] to-[#2a0810]',
    textOnDark: true,
    buyLinks: [
      { label: 'Amazon', href: '#' },
      { label: 'Flipkart', href: '#' },
      { label: 'Kindle', href: '#' },
    ],
  },
];

export const genreFilters = ['All', 'Fiction', 'Devotional', 'Memoir'] as const;
