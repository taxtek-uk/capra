import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading, Lede, Button, ButtonLink } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { fieldClass as field, labelClass as label } from "@/components/ui/fields";
import { requireCustomer, savedDetails } from "@/lib/customer";
import { MARKETING_CONSENT_TEXT } from "@/content/marketing";
import { saveDetails, signOut } from "../actions";
import { PROVINCES } from "@/lib/brand";

/** Personal and never the same twice: rendered on demand and kept out of the index. */
export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Your Details", description: "Update the name, phone number, delivery address and email preferences saved to your account with CAPRA.", path: "/account/details", noIndex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const me = await requireCustomer("/account/details");
  const [{ e }, d] = await Promise.all([searchParams, savedDetails(me)]);
  const a = d.address;

  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Account", path: "/account" }, { name: "Your details", path: "/account/details" }]} />
        <div className="mt-6 max-w-2xl">
          <Eyebrow>Your account</Eyebrow>
          <Heading as="h1">Your details.</Heading>
          <Lede>Saved here, they fill in the checkout for you next time.</Lede>
        </div>

        <form action={saveDetails} className="mt-10 grid max-w-2xl gap-8">
          {e === "saved" && <p role="status" className="rounded-2xl border border-brass-500/40 bg-brass-500/5 p-4 text-sm text-stone-600">Your details are saved.</p>}
          {e === "invalid" && <p role="alert" className="text-sm text-danger">Please check your name, phone number and delivery address.</p>}

          <fieldset className="rounded-2xl border border-ink-950/10 p-6">
            <legend className="px-2 font-display text-xl">Contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={label} htmlFor="ad-name">Name</label><input id="ad-name" name="name" required minLength={2} autoComplete="name" defaultValue={d.name} className={field} /></div>
              <div><label className={label} htmlFor="ad-phone">Phone</label><input id="ad-phone" name="phone" type="tel" placeholder="0300 1234567" required autoComplete="tel" defaultValue={d.phone} className={field} /></div>
              <div>
                <p className={label}>Email</p>
                <p className="py-3 text-sm">{me.email}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-stone-600">Your account is tied to this email address. To use another, sign out and sign in with it.</p>
          </fieldset>

          <fieldset className="rounded-2xl border border-ink-950/10 p-6">
            <legend className="px-2 font-display text-xl">Delivery address</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className={label} htmlFor="ad-line1">Address</label><input id="ad-line1" name="line1" required autoComplete="address-line1" defaultValue={a?.line1} className={field} /></div>
              <div className="sm:col-span-2"><label className={label} htmlFor="ad-line2">Address line 2 <span className="text-stone-600">(optional)</span></label><input id="ad-line2" name="line2" autoComplete="address-line2" defaultValue={a?.line2} className={field} /></div>
              <div><label className={label} htmlFor="ad-city">Town or city</label><input id="ad-city" name="city" required autoComplete="address-level2" defaultValue={a?.city} className={field} /></div>
              <div><label className={label} htmlFor="ad-province">Province</label><select id="ad-province" name="province" defaultValue={a?.province ?? "Punjab"} className={field}>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><label className={label} htmlFor="ad-postcode">Postal code <span className="text-stone-600">(optional)</span></label><input id="ad-postcode" name="postcode" inputMode="numeric" autoComplete="postal-code" defaultValue={a?.postcode} className={field} /></div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-ink-950/10 p-6">
            <legend className="px-2 font-display text-xl">Emails from us</legend>
            <label className="flex cursor-pointer gap-3 text-sm text-stone-600">
              <input type="checkbox" name="marketing" defaultChecked={d.subscribed} className="mt-1" />
              <span>{MARKETING_CONSENT_TEXT}</span>
            </label>
            <p className="mt-3 text-xs text-stone-600">Order and delivery emails are sent either way.</p>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save details</Button>
            <ButtonLink href="/account" variant="ghost">Back to your orders</ButtonLink>
          </div>
        </form>

        <form action={signOut} className="mt-6">
          <Button type="submit" variant="ghost">Sign out</Button>
        </form>
      </Container>
    </Section>
  );
}
