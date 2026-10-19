import { sendEmail } from "@/lib/email";
import { basketLink, claimReminder, dueReminders, purgeOldBaskets } from "@/lib/saved-baskets";
import { basketReminderEmail } from "@/lib/emails/saved-basket";
import { purgeRateLimits } from "@/lib/ratelimit";

/**
 * Daily (vercel.json): the one basket reminder a customer opted into, 24–72 hours later unless they have
 * ordered since; then deletes baskets older than 180 days and idle rate-limit buckets.
 * Vercel calls it with `Authorization: Bearer $CRON_SECRET`; without the secret it refuses to run.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorised", { status: 401 });
  let sent = 0;
  for (const s of await dueReminders()) {
    if (!(await claimReminder(s.id))) continue;
    const mail = basketReminderEmail({ total: s.total, link: basketLink(s) });
    // Logged, not retried: one reminder was promised, and a retry risks two.
    await sendEmail({ to: [s.email], subject: mail.subject, html: mail.html }).then(() => sent++, (err) => console.error("[basket-reminders]", s.id, err));
  }
  return Response.json({ ok: true, sent, purged: await purgeOldBaskets(), limits: await purgeRateLimits().catch(() => 0) });
}
