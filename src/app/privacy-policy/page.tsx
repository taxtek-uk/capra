import { pageMeta } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { BRAND, CONTACT } from "@/lib/brand";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "How CAPRA collects, uses and protects the details you give us when you order, sign in or contact us, and how to ask us to delete them.",
  path: "/privacy-policy",
});

export default function Page() {
  return (
    <InfoPage crumb="Privacy" path="/privacy-policy" eyebrow="Legal" title="Privacy policy." lede={`${BRAND.name} runs ${BRAND.domain.replace("https://", "")}. This page explains what we collect and why.`}>
      <h2>What we collect</h2>
      <ul><li>Orders: your name, mobile number, delivery address, optional email and what you bought.</li><li>Accounts: your email address and the details you choose to save.</li><li>Messages: what you send us through the contact and wholesale forms.</li><li>Visits: the pages viewed, the device type and the city, from our own first-party counter. We never store your IP address, only a one-way scrambled form of it, and we use no advertising trackers.</li></ul>
      <h2>Why</h2>
      <p>To deliver your order, confirm it with you, provide warranty support, answer your messages and understand which pages help people. We email you offers only if you tick the box asking for them, and you can unsubscribe at any time.</p>
      <h2>Who we share it with</h2>
      <p>Only the courier who delivers your parcel (name, phone and address) and the services that run this website: hosting, our database and our email provider. We never sell your details.</p>
      <h2>How long we keep it</h2>
      <p>Orders are kept as business records. Saved baskets are deleted after 180 days and sign-in codes after a day.</p>
      <h2>Your choices</h2>
      <p>Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or WhatsApp {CONTACT.whatsapp} to see, correct or delete your details, or to stop marketing emails.</p>
    </InfoPage>
  );
}
