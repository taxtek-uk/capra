"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { ORDER_STATUSES, PAYMENT_STATUSES, syncOrderStock, type OrderRow } from "@/lib/orders";
import { buildDespatchEmail } from "@/lib/emails/order";

const Schema = z.object({
  ref: z.string().trim().min(3).max(40),
  status: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  paymentRef: z.string().trim().max(120).optional().default(""),
  tracking: z.string().trim().max(120).optional().default(""),
  adminNote: z.string().trim().max(2000).optional().default(""),
  notify: z.string().optional(),
});

/**
 * The one write behind the order screen. Money is never edited: an order records what was charged.
 * Cancelling puts the stock back; reinstating takes it again. The dispatch email needs a tracking number and an email.
 */
export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const sql = db();
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!sql || !parsed.success) return;
  const d = parsed.data;
  const [order] = (await sql`
    update orders set status = ${d.status}, payment_status = ${d.paymentStatus}, payment_ref = ${d.paymentRef || null}, tracking = ${d.tracking || null},
      admin_note = ${d.adminNote || null},
      paid_at = case when ${d.paymentStatus} = 'paid' and paid_at is null then now() when ${d.paymentStatus} <> 'paid' then null else paid_at end,
      updated_at = now()
    where ref = ${d.ref} returning *`) as unknown as OrderRow[];
  if (order && (await syncOrderStock(order))) revalidatePath("/shop");
  if (order && d.notify === "on" && d.tracking && order.contact.email) {
    const mail = buildDespatchEmail({ ref: order.ref, name: order.contact.name, tracking: d.tracking, count: order.lines.reduce((a, l) => a + l.qty, 0) });
    await sendEmail({ to: [order.contact.email], subject: mail.subject, html: mail.html }).catch((err) => console.error("[order dispatch email]", err));
  }
  revalidatePath(`/admin/orders/${d.ref}`);
  revalidatePath("/admin/orders");
}
