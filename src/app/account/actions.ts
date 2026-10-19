"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";
import { sendEmail } from "@/lib/email";
import { buildCodeEmail } from "@/lib/emails/account";
import { PROVINCES } from "@/lib/brand";
import { isPkPhone, normalisePhone } from "@/lib/utils";
import {
  clearCustomerCookie, createCode, currentCustomer, isSubscribed, normaliseEmail, saveCustomerDetails, setMarketingConsent, verifyCode,
} from "@/lib/customer";

export type CodeResult = { ok: true } | { ok: false; error: string };

const clientIp = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
const Email = z.string().trim().email().max(200);
const SLOW = "Too many codes asked for. Please wait a few minutes and try again.";

/** Emails a sign-in code. The response never says whether the address has ordered before. */
export async function requestSignInCode(rawEmail: unknown): Promise<CodeResult> {
  // Rate limit before validation: per connection, and per address (a flood of codes at one inbox).
  const key = typeof rawEmail === "string" ? normaliseEmail(rawEmail).slice(0, 200) : "";
  if (!(await rateLimit(`code:${await clientIp()}`, 6, 15 * 60_000)).ok || !(await rateLimit(`code:${key}`, 3, 15 * 60_000)).ok) return { ok: false, error: SLOW };
  const parsed = Email.safeParse(rawEmail);
  if (!parsed.success) return { ok: false, error: "Please enter a valid email address." };

  const made = await createCode(parsed.data);
  if ("error" in made) return { ok: false, error: made.error === "slow" ? SLOW : "Sign-in is not available just now. You can still check out as a guest." };
  const mail = buildCodeEmail(made.code);
  try {
    await sendEmail({ to: [normaliseEmail(parsed.data)], subject: mail.subject, html: mail.html });
  } catch (err) {
    console.error("[account code email]", err);
    return { ok: false, error: "We could not send the code just now. Please try again." };
  }
  return { ok: true };
}

const Verify = z.object({ email: Email, code: z.string().regex(/^\d{6}$/) });

export async function confirmSignInCode(rawEmail: unknown, rawCode: unknown): Promise<CodeResult> {
  if (!(await rateLimit(`verify:${await clientIp()}`, 20, 15 * 60_000)).ok) return { ok: false, error: "Too many attempts. Please wait a few minutes and try again." };
  const parsed = Verify.safeParse({ email: rawEmail, code: typeof rawCode === "string" ? rawCode.replace(/\s/g, "") : rawCode });
  if (!parsed.success) return { ok: false, error: "Enter the 6-digit code from the email." };
  const result = await verifyCode(parsed.data.email, parsed.data.code);
  if (result === "wrong") return { ok: false, error: "That code is not right. Check the email and try again." };
  if (result === "expired") return { ok: false, error: "That code has expired or had too many tries. Send a new one." };
  return { ok: true };
}

export async function signOut() {
  await clearCustomerCookie();
  redirect("/");
}

/** Signs out without leaving the page: the checkout's "Not you?". */
export async function signOutHere() {
  await clearCustomerCookie();
}

const Details = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().refine(isPkPhone),
  line1: z.string().trim().min(2).max(160),
  line2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2).max(80),
  province: z.enum(PROVINCES),
  postcode: z.string().trim().max(10).optional().default(""),
  marketing: z.literal("on").optional(),
});

export async function saveDetails(formData: FormData) {
  const me = await currentCustomer();
  if (!me) redirect("/account/sign-in?next=/account/details");
  const parsed = Details.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/account/details?e=invalid");
  const d = parsed.data;

  await saveCustomerDetails(me.id, {
    name: d.name, phone: normalisePhone(d.phone),
    address: { line1: d.line1, line2: d.line2, city: d.city, province: d.province, postcode: d.postcode },
  });
  // Written only when the choice changed, so saving an address never creates a consent record.
  const wants = d.marketing === "on";
  if (wants !== (await isSubscribed(me.email))) await setMarketingConsent(me.email, wants, "account");

  revalidatePath("/account/details");
  redirect("/account/details?e=saved");
}
