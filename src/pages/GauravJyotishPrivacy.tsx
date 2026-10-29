import type { ReactNode } from 'react';
import Seo from '../components/Seo';
import LanguageSwitch from '../components/jyotish/LanguageSwitch';
import { APP } from '../data/gauravJyotish';

// The privacy policy Google Play checks for the Gaurav Jyotish app. It is an
// ordinary public route, prerendered to static HTML, so it opens without any
// login or script. The wording is the owner's own text; keep the English and
// Hindi sections in step when either changes.

const PACKAGE = 'com.gauravmishra.jyotish';
const EFFECTIVE_EN = '29 October 2026';
const EFFECTIVE_HI = '29 अक्टूबर 2026';

const linkClass = 'text-[#b4530a] underline underline-offset-2 hover:text-[#0e0a2e]';
const h3Class = 'mt-7 mb-1 font-display text-lg font-semibold text-[#b4530a]';

function H3({ children }: { children: ReactNode }) {
  return <h3 className={h3Class}>{children}</h3>;
}

function UL({ children }: { children: ReactNode }) {
  return <ul className="my-2 list-disc space-y-2 pl-6">{children}</ul>;
}

function InShort({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="my-5 rounded-xl bg-[#fcefe3] px-4 py-3.5">
      <strong>{label}</strong> {children}
    </div>
  );
}

function MailLink() {
  return (
    <a href={`mailto:${APP.email}`} className={linkClass}>
      {APP.email}
    </a>
  );
}

function SiteLink() {
  return (
    <a href="https://authorgaurav.com" className={linkClass}>
      authorgaurav.com
    </a>
  );
}

export default function GauravJyotishPrivacy() {
  return (
    <>
      <Seo
        title="Privacy Policy – Gaurav Jyotish by AuthorGaurav"
        description="Privacy policy for the Gaurav Jyotish Android app by AuthorGaurav (Gaurav Mishra). Birth details stay on your phone."
        path={APP.privacyPath}
        image={APP.ogImage}
      />

      <div className="jyotish">
        <section className="jy-hero">
          <div className="hairline-solid w-full opacity-30" />
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12 md:py-16">
            <div className="flex items-center gap-4">
              <img src={APP.icon} alt="" width={64} height={64} decoding="async" className="h-16 w-16 shrink-0 rounded-2xl" />
              <div>
                <h1 className="font-display text-3xl md:text-4xl">Privacy Policy</h1>
                <p className="mt-1 text-[#f7f3ec]/80">
                  {APP.fullName} · <span lang="hi">{APP.hindiName}</span>
                </p>
              </div>
            </div>
            <div>
              <LanguageSwitch active="en" label="Language" />
            </div>
          </div>
        </section>

        <div className="jy-cream py-12 md:py-16">
          <div className="mx-auto max-w-3xl space-y-8 px-6">
            {/* ======================= ENGLISH ======================= */}
            <section id="english" lang="en" className="jy-card scroll-mt-24 px-5 py-6 leading-relaxed md:px-8 md:py-8">
              <h2 className="font-display text-2xl text-[#0e0a2e]">Privacy Policy</h2>
              <p className="mt-1 text-sm text-muted">
                Effective date: {EFFECTIVE_EN} · App: Gaurav Jyotish by AuthorGaurav (Android, package <code>{PACKAGE}</code>)
              </p>

              <InShort label="In short:">
                the birth details you enter stay on your phone. The app has no account, no ads, no analytics and no tracking. Nothing about you is sent anywhere unless you choose to send it yourself.
              </InShort>

              <H3>Who we are</H3>
              <p>
                The app is made by Gaurav Mishra (AuthorGaurav), based in Singapore. Contact: <MailLink /> · <SiteLink />.
              </p>

              <H3>What the app keeps on your phone</H3>
              <UL>
                <li><strong>Birth details</strong> you add for yourself, family or clients: name, gender, date, time and place of birth, the place where the person lives now (optional) and a group label (optional).</li>
                <li><strong>Calculated charts, forecasts and reports</strong> made from those details.</li>
                <li><strong>Your settings</strong>, such as language and chart style.</li>
                <li><strong>Optional registration</strong>: your name, email and phone, if you enter them.</li>
                <li><strong>Unlock details</strong> (demo edition): the email and unlock code you enter to open the full version.</li>
              </UL>
              <p className="mt-2">
                All of this is stored only in the app&apos;s private storage on your phone. All calculations are done on the phone. The app does not upload this data, and it is excluded from Android cloud backup and from phone-to-phone transfer.
              </p>

              <H3>What leaves your phone, and only when you choose</H3>
              <UL>
                <li><strong>Registration email.</strong> After you register, the app offers to open your own email app with a message to Gaurav Mishra containing your name, email, phone, language, app version and date. It is sent only if you tap <em>Send</em> in your email app. Birth details are never included.</li>
                <li><strong>Unlock code request.</strong> If you ask for an unlock code, your email app opens with a similar message (name, email, phone, app version). Again, it is sent only if you tap <em>Send</em>.</li>
                <li><strong>Sharing a report.</strong> If you tap <em>Share</em> or <em>Save as PDF</em> on a report, it goes only to the app or printer you choose.</li>
                <li><strong>Website and email links</strong> on the About screen open your browser or email app.</li>
              </UL>
              <p className="mt-2">
                Emails you send us are used only to reply to you, to send your unlock code, and to keep a record of who is using the app. They are never sold or shared with anyone else.
              </p>

              <H3>Payments</H3>
              <UL>
                <li><strong>Google Play edition:</strong> the full version is bought through Google Play. Google processes the payment and keeps the purchase record under the <a href="https://policies.google.com/privacy" className={linkClass}>Google Privacy Policy</a>. The app only checks with Google Play whether the full version has been bought; it never sees your card or bank details.</li>
                <li><strong>Demo edition (unlock code):</strong> if you pay by a payment link (for example Razorpay, Stripe, PayPal or UPI), that provider processes the payment under its own privacy policy. We receive the payment confirmation and your email, which we use to make your unlock code.</li>
              </UL>

              <H3>What the app does not do</H3>
              <UL>
                <li>No account or sign-in, no advertising, no analytics or tracking tools, and no selling or sharing of personal data.</li>
                <li>No access to your contacts, location, camera, microphone or files. The demo and full editions ask for no permissions at all. The Google Play edition uses Google Play Billing only for the purchase.</li>
              </UL>
              <p className="mt-2">
                Google Play may collect basic crash and performance data for apps it distributes (Android vitals), according to your device settings and Google&apos;s policies.
              </p>

              <H3>Children</H3>
              <p>
                The app is intended for adults. Parents may add a child&apos;s birth chart; it stays on the parent&apos;s phone like any other profile. We do not knowingly collect information from children. The app never makes predictions about marriage for anyone under 18.
              </p>

              <H3>Your choices and rights</H3>
              <UL>
                <li>Edit or delete any profile, and clear your registration, inside the app. Uninstalling the app removes everything it stored.</li>
                <li>To see, correct or delete anything you have emailed us, write to <MailLink />. We will reply within 30 days.</li>
              </UL>

              <H3>About the readings</H3>
              <p>
                Readings describe what astrological factors are traditionally associated with. They are not predictions or guarantees, and they are not medical, legal or financial advice.
              </p>

              <H3>Changes</H3>
              <p>If this policy changes, the new version will be posted on this page with a new effective date.</p>
            </section>

            {/* ======================= HINDI ======================= */}
            <section id="hindi" lang="hi" className="jy-card scroll-mt-24 px-5 py-6 leading-relaxed md:px-8 md:py-8">
              <h2 className="font-display text-2xl text-[#0e0a2e]">गोपनीयता नीति</h2>
              <p className="mt-1 text-sm text-muted">
                लागू होने की तिथि: {EFFECTIVE_HI} · ऐप: गौरव ज्योतिष, AuthorGaurav द्वारा (Android, पैकेज <code>{PACKAGE}</code>)
              </p>

              <InShort label="संक्षेप में:">
                आप जो जन्म विवरण डालते हैं, वह आपके फ़ोन पर ही रहता है। इस ऐप में न खाता है, न विज्ञापन, न एनालिटिक्स और न कोई ट्रैकिंग। आपकी कोई भी जानकारी तभी बाहर जाती है जब आप ख़ुद उसे भेजना चुनें।
              </InShort>

              <H3>हम कौन हैं</H3>
              <p>
                यह ऐप सिंगापुर में रहने वाले गौरव मिश्रा (AuthorGaurav) ने बनाया है। संपर्क: <MailLink /> · <SiteLink />।
              </p>

              <H3>ऐप आपके फ़ोन पर क्या रखता है</H3>
              <UL>
                <li><strong>जन्म विवरण</strong> जो आप अपने, परिवार या क्लाइंट के लिए जोड़ते हैं: नाम, लिंग, जन्म की तिथि, समय और स्थान, अभी रहने का स्थान (वैकल्पिक) और समूह (वैकल्पिक)।</li>
                <li>इन विवरणों से बनी <strong>कुंडली, भविष्यफल और विश्लेषण</strong>।</li>
                <li><strong>आपकी सेटिंग्स</strong>, जैसे भाषा और चार्ट की शैली।</li>
                <li><strong>वैकल्पिक पंजीकरण</strong>: आपका नाम, ईमेल और फ़ोन, अगर आप भरें।</li>
                <li><strong>अनलॉक विवरण</strong> (डेमो संस्करण): पूर्ण संस्करण खोलने के लिए डाला गया ईमेल और अनलॉक कोड।</li>
              </UL>
              <p className="mt-2">
                यह सब केवल आपके फ़ोन पर ऐप के निजी स्टोरेज में रहता है। सारी गणना फ़ोन पर ही होती है। ऐप यह जानकारी कहीं अपलोड नहीं करता, और यह Android के क्लाउड बैकअप तथा एक फ़ोन से दूसरे फ़ोन में ट्रांसफ़र में भी शामिल नहीं होती।
              </p>

              <H3>क्या फ़ोन से बाहर जाता है, और केवल आपकी मर्ज़ी से</H3>
              <UL>
                <li><strong>पंजीकरण ईमेल।</strong> पंजीकरण के बाद ऐप आपका अपना ईमेल ऐप खोलने का विकल्प देता है। उसमें गौरव मिश्रा के नाम संदेश होता है, जिसमें आपका नाम, ईमेल, फ़ोन, भाषा, ऐप का संस्करण और तिथि भरी होती है। यह तभी जाता है जब आप ईमेल ऐप में <em>भेजें</em> दबाते हैं। जन्म विवरण इसमें कभी नहीं होता।</li>
                <li><strong>अनलॉक कोड का अनुरोध।</strong> अनलॉक कोड माँगने पर भी आपका ईमेल ऐप ऐसे ही संदेश के साथ खुलता है (नाम, ईमेल, फ़ोन, ऐप का संस्करण)। यह भी तभी जाता है जब आप <em>भेजें</em> दबाते हैं।</li>
                <li><strong>विश्लेषण साझा करना।</strong> किसी विश्लेषण पर <em>साझा करें</em> या <em>PDF के रूप में सहेजें</em> दबाने पर वह केवल उसी ऐप या प्रिंटर तक जाता है जिसे आप चुनते हैं।</li>
                <li>&ldquo;परिचय&rdquo; स्क्रीन पर <strong>वेबसाइट और ईमेल के लिंक</strong> आपका ब्राउज़र या ईमेल ऐप खोलते हैं।</li>
              </UL>
              <p className="mt-2">
                आपके भेजे ईमेल का उपयोग केवल आपको जवाब देने, अनलॉक कोड भेजने और ऐप के उपयोगकर्ताओं का रिकॉर्ड रखने के लिए होता है। इन्हें न बेचा जाता है, न किसी और को दिया जाता है।
              </p>

              <H3>भुगतान</H3>
              <UL>
                <li><strong>Google Play संस्करण:</strong> पूर्ण संस्करण Google Play से ख़रीदा जाता है। भुगतान Google करता है और ख़रीद का रिकॉर्ड <a href="https://policies.google.com/privacy?hl=hi" className={linkClass}>Google की गोपनीयता नीति</a> के अनुसार रखता है। ऐप केवल Google Play से यह पूछता है कि पूर्ण संस्करण ख़रीदा गया है या नहीं। आपके कार्ड या बैंक का विवरण ऐप तक कभी नहीं आता।</li>
                <li><strong>डेमो संस्करण (अनलॉक कोड):</strong> अगर आप किसी भुगतान लिंक (जैसे Razorpay, Stripe, PayPal या UPI) से भुगतान करते हैं, तो भुगतान वही सेवा अपनी गोपनीयता नीति के अनुसार संभालती है। हमें केवल भुगतान की पुष्टि और आपका ईमेल मिलता है, जिससे आपका अनलॉक कोड बनाया जाता है।</li>
              </UL>

              <H3>ऐप क्या नहीं करता</H3>
              <UL>
                <li>न खाता या लॉग-इन, न विज्ञापन, न एनालिटिक्स या ट्रैकिंग, और न व्यक्तिगत जानकारी बेचना या साझा करना।</li>
                <li>आपके संपर्क, लोकेशन, कैमरा, माइक्रोफ़ोन या फ़ाइलों तक कोई पहुँच नहीं। डेमो और पूर्ण संस्करण कोई अनुमति नहीं माँगते। Google Play संस्करण केवल ख़रीद के लिए Google Play Billing का उपयोग करता है।</li>
              </UL>
              <p className="mt-2">
                Google Play अपने ज़रिए वितरित ऐप्स के बारे में क्रैश और प्रदर्शन का बुनियादी डेटा (Android vitals) आपकी डिवाइस सेटिंग्स और Google की नीतियों के अनुसार एकत्र कर सकता है।
              </p>

              <H3>बच्चे</H3>
              <p>
                यह ऐप वयस्कों के लिए है। माता-पिता अपने बच्चे की कुंडली जोड़ सकते हैं; वह भी बाक़ी प्रोफ़ाइल की तरह माता-पिता के फ़ोन पर ही रहती है। हम जानबूझकर बच्चों से कोई जानकारी एकत्र नहीं करते। 18 वर्ष से कम आयु के किसी व्यक्ति के लिए ऐप विवाह के बारे में कोई फल नहीं बताता।
              </p>

              <H3>आपके विकल्प और अधिकार</H3>
              <UL>
                <li>ऐप के भीतर ही किसी भी प्रोफ़ाइल को बदलें या मिटाएँ, और अपना पंजीकरण हटाएँ। ऐप हटाने (अनइंस्टॉल) पर उसका रखा सब कुछ मिट जाता है।</li>
                <li>हमें भेजी गई किसी जानकारी को देखने, सुधारने या मिटवाने के लिए <MailLink /> पर लिखें। हम 30 दिनों के भीतर उत्तर देंगे।</li>
              </UL>

              <H3>फल के बारे में</H3>
              <p>
                फल यह बताते हैं कि परंपरा में किस ज्योतिषीय योग या स्थिति को किस बात से जोड़ा जाता है। ये भविष्यवाणी या गारंटी नहीं हैं, और न ही चिकित्सा, क़ानूनी या आर्थिक सलाह हैं।
              </p>

              <H3>बदलाव</H3>
              <p>इस नीति में बदलाव होने पर नया रूप नई तिथि के साथ इसी पेज पर लगाया जाएगा।</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
