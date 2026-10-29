// Content for the Gaurav Jyotish app page (/gaurav-jyotish). English and Hindi
// are written separately rather than translated word for word, and the page
// renders both in full (English first, Hindi below an #hindi anchor).
//
// Two values are intentionally left empty until they exist:
//   - APP.playStoreUrl: while null the "Get it on Google Play" button reads
//     "Coming soon" and is not a link.
//   - APP.fullVersionPrice: while null the Editions card simply says it is a
//     one-time purchase. Set it to a display string such as "₹299".
// Screenshots: put the 9:16 PNG/WebP files in public/images/apps/gaurav-jyotish/
// and set each entry's `src` below. Entries without a `src` render a placeholder.

export type Lang = 'en' | 'hi';

export const APP = {
  name: 'Gaurav Jyotish',
  fullName: 'Gaurav Jyotish by AuthorGaurav',
  hindiName: 'गौरव ज्योतिष',
  path: '/gaurav-jyotish',
  privacyPath: '/gaurav-jyotish-privacy',
  email: 'gaurav.mishra65@gmail.com',
  demoSubject: 'Gaurav Jyotish demo request',
  playStoreUrl: null as string | null,
  fullVersionPrice: null as string | null,
  icon: '/images/apps/gaurav-jyotish/icon-320.webp',
  iconLarge: '/images/apps/gaurav-jyotish/icon-512.png',
  ogImage: '/images/apps/gaurav-jyotish/og-gaurav-jyotish.png',
  seoTitle: 'Gaurav Jyotish – Kundali, Milan, Muhurta & Numerology App | AuthorGaurav',
  seoDescription:
    'Vedic kundali, kundli milan, muhurta, numerology and a three-year forecast on your Android phone. Private, offline, in English and Hindi. By Gaurav Mishra.',
};

export const demoMailto = `mailto:${APP.email}?subject=${encodeURIComponent(APP.demoSubject)}`;

export type FeatureIcon = 'kundali' | 'vedic' | 'milan' | 'muhurta' | 'numerology' | 'forecast' | 'reading' | 'saved' | 'language';
export type BenefitIcon = 'private' | 'offline' | 'careful' | 'honest' | 'family' | 'payment';

interface Item<I extends string> {
  icon: I;
  title: string;
  body: string;
}

export interface JyotishCopy {
  lang: Lang;
  sectionLabel: string;
  switchLabel: string;
  hero: {
    eyebrow: string;
    headline: string;
    subline: string;
    play: string;
    playSoon: string;
    demo: string;
    iconAlt: string;
  };
  features: { eyebrow: string; title: string; items: Item<FeatureIcon>[] };
  benefits: { eyebrow: string; title: string; items: Item<BenefitIcon>[] };
  editions: {
    eyebrow: string;
    title: string;
    demoTitle: string;
    demoBody: string;
    fullTitle: string;
    /** Rendered as `${beforePrice}${price}${afterPrice}` when a price is set, otherwise `${beforePrice}${afterPrice}`. */
    fullBeforePrice: string;
    fullPriceWrap: (price: string) => string;
    fullAfterPrice: string;
  };
  screenshots: { eyebrow: string; title: string; region: string; placeholder: string; prev: string; next: string };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  maker: { eyebrow: string; title: string; body: string; link: string };
  contact: { eyebrow: string; title: string; emailLabel: string; privacy: string; smallPrint: string };
}

export const copy: Record<Lang, JyotishCopy> = {
  en: {
    lang: 'en',
    sectionLabel: 'English',
    switchLabel: 'Language',
    hero: {
      eyebrow: 'Android app · English & हिंदी',
      headline: 'Your birth chart, read with care.',
      subline:
        'Kundali, Kundli Milan, Muhurta, numerology and a three-year forecast, worked out on your phone. Private, offline, in English and Hindi.',
      play: 'Get it on Google Play',
      playSoon: 'Coming soon',
      demo: 'Try the free demo',
      iconAlt: 'Gaurav Jyotish app icon: a gold North Indian kundali grid with a sun at the centre, ringed by nine gold dots on a deep indigo background',
    },
    features: {
      eyebrow: 'What is inside',
      title: 'Everything a kundali reading needs',
      items: [
        { icon: 'kundali', title: 'Kundali', body: 'North or South Indian chart, planets with nakshatra and pada, Vimshottari dashas with the current period marked, yogas with how rare each one is, and Shadbala strength.' },
        { icon: 'vedic', title: 'In-depth Vedic details', body: 'Panchang, Ashtakavarga, Yogini dasha, Jaimini, Varshaphal (annual chart), KP, and the D9 and D10 divisional charts.' },
        { icon: 'milan', title: 'Kundli Milan', body: 'Ashtakoota Guna Milan out of 36 with every koota explained, the ten Porutham of South Indian practice, and the Mangal check from Lagna, Moon and Venus, with cancellations stated.' },
        { icon: 'muhurta', title: 'Muhurta', body: 'Good dates and times for a wedding, griha pravesh, a new venture and more, checked against tithi, nakshatra, yoga, karana, weekday, lagna, Rahu Kaal, and the Tarabala and Chandrabala of the people involved.' },
        { icon: 'numerology', title: 'Numerology', body: 'Mulank, Bhagyank, Chaldean name number, Life Path and other Pythagorean numbers, the Loshu grid, the Kua number, and name spelling options that keep the name’s sound.' },
        { icon: 'forecast', title: 'Three-year forecast', body: 'Year by year for Marriage, Work, Health (energy, stress and rest only) and Love & family. A theme is highlighted only when several systems agree.' },
        { icon: 'reading', title: 'Full reading', body: 'A detailed report combining Vedic, Western, Chinese BaZi, numerology and Lal Kitab, with remedies. Save it as a PDF or share it.' },
        { icon: 'saved', title: 'Saved Kundlis', body: 'Keep charts for family, friends and clients, with search and groups.' },
        { icon: 'language', title: 'English and हिंदी', body: 'Switch the whole app, and every report, at any time.' },
      ],
    },
    benefits: {
      eyebrow: 'Why Gaurav Jyotish',
      title: 'Made to be trusted',
      items: [
        { icon: 'private', title: 'Private by design', body: 'Birth details never leave your phone. No account, no ads, no tracking.' },
        { icon: 'offline', title: 'Works offline', body: 'Every calculation runs on the phone.' },
        { icon: 'careful', title: 'Careful calculation', body: 'Planetary positions from the Swiss Ephemeris, Lahiri ayanamsa by default (changeable in Settings), and results cross-checked across systems.' },
        { icon: 'honest', title: 'Honest readings', body: 'Describes what each factor is traditionally associated with. Never predicts death, illness or divorce, and gives no marriage readings for anyone under 18.' },
        { icon: 'family', title: 'The whole family in one place', body: 'Every chart you keep, in your language.' },
        { icon: 'payment', title: 'One payment, no subscription', body: 'Buy the full version once.' },
      ],
    },
    editions: {
      eyebrow: 'Editions',
      title: 'Start free, unlock when you are ready',
      demoTitle: 'Free demo',
      demoBody: 'Every feature for one Kundli.',
      fullTitle: 'Full version',
      fullBeforePrice: 'Unlimited Kundlis, Kundli Milan for any two people, forecasts and full readings for everyone. A one-time purchase',
      fullPriceWrap: (price) => ` (${price})`,
      fullAfterPrice: '. Unlock it inside the app through Google Play, or in the demo with an unlock code you receive by email after payment.',
    },
    screenshots: {
      eyebrow: 'Screenshots',
      title: 'See it on your phone',
      region: 'App screenshots. Swipe or scroll sideways to see more.',
      placeholder: 'Screenshot coming soon',
      prev: 'Previous screenshots',
      next: 'Next screenshots',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Frequently asked questions',
      items: [
        { q: 'Is my data safe?', a: 'Birth details stay only on your phone, and the app has no account and sends nothing. You can delete any Kundli, or uninstall the app to remove everything.' },
        { q: 'Does it need internet?', a: 'No. Only buying through Google Play needs a connection.' },
        { q: 'Which ayanamsa and house system?', a: 'Lahiri and whole-sign houses by default. The ayanamsa and node type can be changed in Settings.' },
        { q: 'Are these predictions?', a: 'No. Readings describe traditional associations, not guarantees, and are not medical, legal or financial advice. Confirm important dates with your family astrologer or panchang.' },
        { q: 'How do I unlock the full version?', a: 'Through Google Play inside the app, or in the demo with an unlock code sent by email after payment.' },
      ],
    },
    maker: {
      eyebrow: 'About the maker',
      title: 'Who made it',
      body: 'Made by Gaurav Mishra, author of the Gaurav Mishra thriller series and a technology professional based in Singapore.',
      link: 'About Gaurav',
    },
    contact: {
      eyebrow: 'Contact and legal',
      title: 'Get in touch',
      emailLabel: 'Email',
      privacy: 'Privacy Policy',
      smallPrint: 'Readings are for reflection and guidance, not guarantees.',
    },
  },

  hi: {
    lang: 'hi',
    sectionLabel: 'हिंदी',
    switchLabel: 'भाषा',
    hero: {
      eyebrow: 'Android ऐप · हिंदी और English',
      headline: 'आपकी जन्मकुंडली, पूरे ध्यान और सम्मान के साथ।',
      subline:
        'कुंडली, कुंडली मिलान, मुहूर्त, अंक ज्योतिष और तीन साल का फल, सारी गणना आपके फ़ोन पर ही। निजी, बिना इंटरनेट के, हिंदी और अंग्रेज़ी दोनों में।',
      play: 'Google Play पर पाएँ',
      playSoon: 'जल्द आ रहा है',
      demo: 'मुफ़्त डेमो आज़माएँ',
      iconAlt: 'गौरव ज्योतिष ऐप का आइकन: गहरे नीले रंग की पृष्ठभूमि पर सुनहरी उत्तर भारतीय कुंडली, बीच में सूर्य और चारों ओर नौ सुनहरे बिंदु',
    },
    features: {
      eyebrow: 'ऐप में क्या है',
      title: 'कुंडली पढ़ने के लिए सब कुछ एक जगह',
      items: [
        { icon: 'kundali', title: 'कुंडली', body: 'उत्तर या दक्षिण भारतीय शैली का चार्ट, नक्षत्र और पद के साथ ग्रह, वर्तमान अवधि के निशान के साथ विंशोत्तरी दशा, हर योग कितना दुर्लभ है यह बताते हुए योग, और षड्बल।' },
        { icon: 'vedic', title: 'विस्तृत वैदिक जानकारी', body: 'पंचांग, अष्टकवर्ग, योगिनी दशा, जैमिनी, वर्षफल (वार्षिक कुंडली), केपी, तथा नवांश (D9) और दशमांश (D10) चार्ट।' },
        { icon: 'milan', title: 'कुंडली मिलान', body: '36 में से अष्टकूट गुण मिलान, हर कूट की व्याख्या के साथ; दक्षिण भारत की दस पोरुथम; और लग्न, चंद्र तथा शुक्र से मंगल दोष की जाँच, जहाँ दोष कटता है वह भी बताया गया है।' },
        { icon: 'muhurta', title: 'मुहूर्त', body: 'विवाह, गृह प्रवेश, नया कार्य आदि के लिए शुभ तिथि और समय, जो तिथि, नक्षत्र, योग, करण, वार, लग्न, राहु काल और संबंधित लोगों के ताराबल व चंद्रबल से जाँचे गए हैं।' },
        { icon: 'numerology', title: 'अंक ज्योतिष', body: 'मूलांक, भाग्यांक, कैल्डियन नाम अंक, लाइफ़ पाथ व अन्य पाइथागोरियन अंक, लोशू ग्रिड, कुआ अंक, और नाम की वर्तनी के ऐसे विकल्प जो नाम की ध्वनि बनाए रखें।' },
        { icon: 'forecast', title: 'तीन साल का फल', body: 'विवाह, कार्य, स्वास्थ्य (केवल ऊर्जा, तनाव और विश्राम) तथा प्रेम व परिवार, साल दर साल। कोई विषय तभी उभारा जाता है जब कई पद्धतियाँ एक ही संकेत दें।' },
        { icon: 'reading', title: 'पूरा विश्लेषण', body: 'वैदिक, पश्चिमी, चीनी बाज़ी (BaZi), अंक ज्योतिष और लाल किताब को मिलाकर बनी विस्तृत रिपोर्ट, उपायों सहित। PDF में सहेजें या साझा करें।' },
        { icon: 'saved', title: 'सहेजी हुई कुंडलियाँ', body: 'परिवार, मित्रों और क्लाइंट की कुंडलियाँ सहेजें, खोज और समूहों की सुविधा के साथ।' },
        { icon: 'language', title: 'हिंदी और अंग्रेज़ी', body: 'पूरा ऐप और हर रिपोर्ट, जब चाहें, दूसरी भाषा में बदलें।' },
      ],
    },
    benefits: {
      eyebrow: 'गौरव ज्योतिष क्यों',
      title: 'भरोसे के लिए बनाया गया',
      items: [
        { icon: 'private', title: 'शुरू से निजी', body: 'जन्म विवरण आपके फ़ोन से बाहर नहीं जाता। न खाता, न विज्ञापन, न ट्रैकिंग।' },
        { icon: 'offline', title: 'बिना इंटरनेट के चलता है', body: 'हर गणना फ़ोन पर ही होती है।' },
        { icon: 'careful', title: 'सावधानी से की गई गणना', body: 'ग्रहों की स्थिति स्विस एफ़ेमेरिस से, डिफ़ॉल्ट रूप से लाहिरी अयनांश (सेटिंग्स में बदला जा सकता है), और परिणाम कई पद्धतियों में मिलाकर जाँचे गए।' },
        { icon: 'honest', title: 'ईमानदार फल', body: 'हर कारक की परंपरागत मान्यता बताता है। मृत्यु, बीमारी या तलाक़ की भविष्यवाणी कभी नहीं करता, और 18 वर्ष से कम आयु के किसी व्यक्ति के लिए विवाह का फल नहीं देता।' },
        { icon: 'family', title: 'पूरा परिवार एक जगह', body: 'आपकी सहेजी हर कुंडली, आपकी अपनी भाषा में।' },
        { icon: 'payment', title: 'एक बार भुगतान, कोई सब्सक्रिप्शन नहीं', body: 'पूर्ण संस्करण बस एक बार ख़रीदें।' },
      ],
    },
    editions: {
      eyebrow: 'संस्करण',
      title: 'मुफ़्त में शुरू करें, मन होने पर अनलॉक करें',
      demoTitle: 'मुफ़्त डेमो',
      demoBody: 'एक कुंडली के लिए सभी सुविधाएँ।',
      fullTitle: 'पूर्ण संस्करण',
      fullBeforePrice: 'असीमित कुंडलियाँ, किन्हीं भी दो लोगों के लिए कुंडली मिलान, और सभी के लिए भविष्यफल व पूरा विश्लेषण। एक बार की ख़रीद',
      fullPriceWrap: (price) => ` (${price})`,
      fullAfterPrice: '। ऐप के भीतर Google Play से अनलॉक करें, या डेमो में भुगतान के बाद ईमेल से मिले अनलॉक कोड से।',
    },
    screenshots: {
      eyebrow: 'झलकियाँ',
      title: 'अपने फ़ोन पर देखें',
      region: 'ऐप की झलकियाँ। और देखने के लिए बगल में स्वाइप या स्क्रॉल करें।',
      placeholder: 'झलक जल्द ही',
      prev: 'पिछली झलकियाँ',
      next: 'अगली झलकियाँ',
    },
    faq: {
      eyebrow: 'सवाल',
      title: 'अक्सर पूछे जाने वाले सवाल',
      items: [
        { q: 'क्या मेरा डेटा सुरक्षित है?', a: 'जन्म विवरण केवल आपके फ़ोन पर रहता है। ऐप में कोई खाता नहीं है और यह कुछ भी कहीं नहीं भेजता। आप कोई भी कुंडली मिटा सकते हैं, या ऐप हटाकर सब कुछ हटा सकते हैं।' },
        { q: 'क्या इसके लिए इंटरनेट चाहिए?', a: 'नहीं। केवल Google Play से ख़रीदते समय कनेक्शन की ज़रूरत पड़ती है।' },
        { q: 'कौन-सा अयनांश और भाव पद्धति?', a: 'डिफ़ॉल्ट रूप से लाहिरी अयनांश और सम्पूर्ण-राशि (होल-साइन) भाव। अयनांश और नोड का प्रकार सेटिंग्स में बदला जा सकता है।' },
        { q: 'क्या ये भविष्यवाणियाँ हैं?', a: 'नहीं। फल परंपरागत मान्यताओं का वर्णन हैं, गारंटी नहीं, और ये चिकित्सा, क़ानूनी या आर्थिक सलाह नहीं हैं। ज़रूरी तिथियाँ अपने पारिवारिक ज्योतिषी या पंचांग से भी पक्की कर लें।' },
        { q: 'पूर्ण संस्करण कैसे अनलॉक करें?', a: 'ऐप के भीतर Google Play के ज़रिए, या डेमो में भुगतान के बाद ईमेल से भेजे गए अनलॉक कोड से।' },
      ],
    },
    maker: {
      eyebrow: 'निर्माता के बारे में',
      title: 'किसने बनाया',
      body: 'इसे गौरव मिश्रा ने बनाया है, जो गौरव मिश्रा थ्रिलर श्रृंखला के लेखक और सिंगापुर में रहने वाले एक टेक्नोलॉजी प्रोफ़ेशनल हैं।',
      link: 'गौरव के बारे में',
    },
    contact: {
      eyebrow: 'संपर्क और नीतियाँ',
      title: 'संपर्क करें',
      emailLabel: 'ईमेल',
      privacy: 'गोपनीयता नीति',
      smallPrint: 'फल चिंतन और मार्गदर्शन के लिए हैं, गारंटी नहीं।',
    },
  },
};

/** The five gallery screens, in order. Set `src` (a root-relative path under /images/apps/gaurav-jyotish/) once the real screenshot is uploaded. */
export interface JyotishScreenshot {
  key: string;
  src?: string;
  width?: number;
  height?: number;
  label: Record<Lang, string>;
  alt: Record<Lang, string>;
}

export const screenshots: JyotishScreenshot[] = [
  { key: 'home', label: { en: 'Home', hi: 'होम' }, alt: { en: 'Gaurav Jyotish home screen', hi: 'गौरव ज्योतिष का होम स्क्रीन' } },
  { key: 'kundali', label: { en: 'Kundali chart', hi: 'कुंडली चार्ट' }, alt: { en: 'A kundali chart with planets, nakshatra and dasha', hi: 'ग्रहों, नक्षत्र और दशा के साथ कुंडली चार्ट' } },
  { key: 'milan', label: { en: 'Kundli Milan score', hi: 'कुंडली मिलान स्कोर' }, alt: { en: 'Kundli Milan score out of 36', hi: '36 में से कुंडली मिलान का स्कोर' } },
  { key: 'forecast', label: { en: 'Three-year forecast', hi: 'तीन साल का फल' }, alt: { en: 'Three-year forecast, year by year', hi: 'साल दर साल तीन साल का फल' } },
  { key: 'reading', label: { en: 'Full reading', hi: 'पूरा विश्लेषण' }, alt: { en: 'A full reading report', hi: 'पूरे विश्लेषण की रिपोर्ट' } },
];
