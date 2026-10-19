"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireOwner } from "@/lib/admin";
import { normaliseEmail } from "@/lib/customer";
import { customerHref, deleteCustomerAccount, signOutEverywhere, unsubscribeByStaff } from "@/lib/customers-admin";

const Email = z.string().trim().max(200).email().transform(normaliseEmail);

function back(email: string, note: string): never {
  redirect(`${customerHref(email)}?e=${note}`);
}

function emailFrom(formData: FormData) {
  const parsed = Email.safeParse(formData.get("email"));
  if (!parsed.success) redirect("/admin/customers");
  return parsed.data;
}

export async function signOutCustomer(formData: FormData) {
  await requireAdmin();
  const email = emailFrom(formData);
  await signOutEverywhere(email);
  back(email, "signedout");
}

/** Staff may unsubscribe someone — after a phone call, say — but never subscribe them. */
export async function unsubscribeCustomer(formData: FormData) {
  await requireAdmin();
  const email = emailFrom(formData);
  await unsubscribeByStaff(email);
  back(email, "unsubscribed");
}

/** Owner only, and the email must be typed again: a deleted account cannot be brought back. */
export async function deleteAccount(formData: FormData) {
  await requireOwner();
  const email = emailFrom(formData);
  if (normaliseEmail(String(formData.get("confirm") ?? "")) !== email) back(email, "confirm");
  await deleteCustomerAccount(email);
  back(email, "deleted");
}
