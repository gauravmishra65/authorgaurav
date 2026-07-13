export type Genre = 'Fiction' | 'Memoir' | 'Devotional';
export type Language = 'English' | 'Hindi';

export interface Testimonial {
  quote: string;
  name: string;
  source?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  titleHtml?: string;
  author: string;
  tagline: string;
  synopsis: string;
  genre: Genre;
  language: Language;
  isHindi?: boolean;
  gradient: string;
  textOnDark?: boolean;
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  bookWebsite?: string;
  buyLinks: { label: string; href: string }[];
  testimonials?: Testimonial[];
}

export const books: Book[] = [
  {
    id: 'offbeat-love',
    slug: 'offbeat-love',
    title: 'Offbeat Love',
    author: 'Gaurav Mishra',
    tagline: 'Two Worlds, One Melody',
    synopsis:
      'A heartfelt romance about love, music, family expectations, and the courage to break free from a golden cage. Set against the pulse of Mumbai, it follows two souls from different worlds who find one shared melody.',
    genre: 'Fiction',
    language: 'English',
    gradient: 'from-ink via-rose to-amber-400',
    textOnDark: true,
    imageSrc: '/images/book-covers/generated-image.webp',
    imageWidth: 1024,
    imageHeight: 1536,
    bookWebsite: 'https://off-beat-love.com',
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'A melody you can feel on every page — I read it in two sittings.', name: 'Reader review', source: 'Amazon' }, // TODO: replace with real review
      { quote: 'Offbeat Love finds the courage in quiet choices. Beautifully observed.', name: 'Priya S.', source: 'Goodreads' }, // TODO: replace with real review
    ],
  },
  {
    id: 'anootha-pyar',
    slug: 'anootha-pyar',
    title: 'अनूठा प्यार',
    author: 'गौरव मिश्रा',
    tagline: 'दो दुनियाएँ, एक धुन',
    synopsis:
      'अनूठा प्यार एक हृदयस्पर्शी प्रेम कथा है — प्यार, संगीत, परिवार की उम्मीदों और सुनहरे पिंजरे से आज़ादी के साहस की। मुंबई की धड़कनों के बीच दो अलग दुनियाओं से आते हुए भी एक धुन को पाने वाली कहानी।',
    genre: 'Fiction',
    language: 'Hindi',
    isHindi: true,
    gradient: 'from-ink via-rose to-amber-400',
    textOnDark: true,
    imageSrc: '/images/book-covers/generated-image-1.webp',
    imageWidth: 1024,
    imageHeight: 1536,
    bookWebsite: 'https://off-beat-love.com',
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'एक ऐसी कहानी जो दिल को छू जाती है — हर पन्ने पर संगीत महसूस होता है।', name: 'पाठक समीक्षा', source: 'Amazon' }, // TODO: replace with real review
    ],
  },
  {
    id: 'shadow-code',
    slug: 'shadow-code',
    title: 'Shadow Code',
    titleHtml: '<span style="color:#e2e8f0">SHADOW</span> <span style="color:#E6C87A">CODE</span>',
    author: 'Gaurav Mishra',
    tagline: 'In a world of algorithms and lies, the truth hides in the shadows.',
    synopsis:
      "A taut techno-thriller that moves between Mumbai's financial district and the dark architecture of the internet. When a whistleblower uncovers a pattern buried in code, the chase that follows blurs the line between watcher and watched.",
    genre: 'Fiction',
    language: 'English',
    gradient: 'from-[#0a1424] via-[#0e1a2b] to-[#16243a]',
    textOnDark: true,
    imageSrc: '/images/book-covers/Shadow_Code-1.webp',
    imageWidth: 666,
    imageHeight: 946,
    bookWebsite: 'https://the-shadow-code.com',
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'A relentless, smart thriller — I did not see the ending coming.', name: 'Reader review', source: 'Amazon' }, // TODO: replace with real review
      { quote: 'Sharp, paranoid, and thoroughly modern. Shadow Code earns its tension.', name: 'Arjun K.', source: 'Goodreads' }, // TODO: replace with real review
    ],
  },
  {
    id: 'nirdosh-gangster',
    slug: 'nirdosh-gangster',
    title: 'निर्दोष गैंगस्टर',
    author: 'गौरव मिश्रा',
    tagline: 'Innocent on the inside. Dangerous on the outside.',
    synopsis:
      "A gripping crime thriller in Hindi — the story of a man trapped between two worlds, forced to wear a gangster's face while carrying an innocent heart. Tension, loyalty, and survival collide.",
    genre: 'Fiction',
    language: 'Hindi',
    isHindi: true,
    gradient: 'from-[#111] via-[#1a1a1a] to-[#222]',
    textOnDark: true,
    imageSrc: '/images/book-covers/Innocent.webp',
    imageWidth: 569,
    imageHeight: 895,
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'एक किरदार जो जितना खतरनाक दिखता है, उतना ही मासूम है — कहानी बांधे रखती है।', name: 'पाठक समीक्षा', source: 'Amazon' }, // TODO: replace with real review
    ],
  },
  {
    id: 'journey-of-grace',
    slug: 'journey-of-grace',
    title: 'A Journey of Grace',
    author: 'Gaurav Mishra',
    tagline: 'A Travel Memoir of Faith, Discovery & Divine Connections.',
    synopsis:
      'A reflective travel memoir that traces a journey across sacred landscapes and quiet roadside towns — a search for meaning, for the divine in the everyday, and for the grace that travels with us when we finally learn to listen.',
    genre: 'Memoir',
    language: 'English',
    gradient: 'from-amber-200 via-gold-lt to-cream',
    textOnDark: false,
    imageSrc: '/images/book-covers/generated-image_(4).webp',
    imageWidth: 1024,
    imageHeight: 1536,
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'A quiet, honest memoir — it reads like a long conversation with an old friend.', name: 'Reader review', source: 'Amazon' }, // TODO: replace with real review
    ],
  },
  {
    id: 'vishnu-sahasranama',
    slug: 'vishnu-sahasranama',
    title: 'श्री विष्णु सहस्रनामः',
    author: 'गौरव मिश्रा',
    tagline: 'सरल अर्थ, भावार्थ और दैनिक जीवन में प्रयोग',
    synopsis:
      'भगवान विष्णु के हजार नामों का सरल, भावपूर्ण अर्थ और भावार्थ — युवाओं और आधुनिक पाठकों के लिए, ताकि भक्ति केवल पठन तक सीमित न रहे, बल्कि दैनिक जीवन का हिस्सा बन जाए।',
    genre: 'Devotional',
    language: 'Hindi',
    isHindi: true,
    gradient: 'from-[#0d1b46] via-[#10245e] to-[#0a1438]',
    textOnDark: true,
    imageSrc: '/images/book-covers/VS.webp',
    imageWidth: 346,
    imageHeight: 937,
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'सरल भाषा में गहरी बात — हर नाम का अर्थ जीवन से जुड़ता चला जाता है।', name: 'पाठक समीक्षा', source: 'Amazon' }, // TODO: replace with real review
    ],
  },
  {
    id: 'lalita-sahasranama',
    slug: 'lalita-sahasranama',
    title: 'श्री ललितासहस्रनाम',
    author: 'गौरव मिश्रा',
    tagline: 'सरल अर्थ, भावार्थ और दैनिक जीवन में प्रयोग',
    synopsis:
      'दिव्य माता ललिता के हजार नामों का सरल अर्थ और भावार्थ। एक ऐसा प्रयास जो शास्त्रीय ज्ञान को आज की भाषा में रखता है, ताकि भक्ति और ज्ञान दोनों साथ चलें।',
    genre: 'Devotional',
    language: 'Hindi',
    isHindi: true,
    gradient: 'from-[#3a0d1a] via-[#5a1026] to-[#2a0810]',
    textOnDark: true,
    imageSrc: '/images/book-covers/MAA-Lalita.webp',
    imageWidth: 548,
    imageHeight: 788,
    buyLinks: [
      { label: 'Amazon', href: '#' }, // TODO: real link
      { label: 'Flipkart', href: '#' }, // TODO: real link
      { label: 'Kindle', href: '#' }, // TODO: real link
    ],
    testimonials: [
      { quote: 'भक्ति और ज्ञान का सुंदर संगम — दैनिक पाठ के लिए एक अनमोल संग्रह।', name: 'पाठक समीक्षा', source: 'Amazon' }, // TODO: replace with real review
    ],
  },
];

export const genreFilters = ['All', 'Fiction', 'Devotional', 'Memoir'] as const;
