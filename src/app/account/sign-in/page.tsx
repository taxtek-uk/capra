import { redirect } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading, Lede } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CodeSignIn } from "@/components/account/CodeSignIn";
import { accountsEnabled, currentCustomer, safeNext } from "@/lib/customer";
import { CONTACT } from "@/lib/brand";

/** Personal and never the same twice: rendered on demand and kept out of the index. */
export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Sign In", description: "Sign in to your account with CAPRA using a code sent to your email, to see your orders and check out faster.", path: "/account/sign-in", noIndex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await currentCustomer()) redirect(next);

  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Account", path: "/account" }, { name: "Sign in", path: "/account/sign-in" }]} />
        <div className="mt-6 max-w-xl">
          <Eyebrow>Your account</Eyebrow>
          <Heading as="h1">Sign in with your email.</Heading>
          <Lede>No password to remember. We email you a 6-digit code, and every order placed with that address is waiting in your account.</Lede>
          <div className="mt-8 rounded-2xl border border-ink-950/10 p-6">
            {accountsEnabled() ? (
              <CodeSignIn next={next} />
            ) : (
              <p className="text-sm text-stone-600">
                Sign-in is not available just now. For help with an order, call <a href={CONTACT.phoneTel} className="underline underline-offset-4">{CONTACT.phone}</a> or email <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a>.
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
