import { requireOwner } from "@/lib/admin";
import { consentExportRows } from "@/lib/customers-admin";
import { toCsv } from "@/lib/forms";

/**
 * Owner only: the marketing consent list as CSV, for import into the external mailing tool.
 * Unsubscribed rows are included so the tool can suppress them. A BOM keeps Excel reading UTF-8.
 */
export async function GET() {
  await requireOwner();
  const rows = await consentExportRows();
  const csv = toCsv([
    ["email", "status", "name", "source", "subscribed_at", "unsubscribed_at", "consent_text"],
    ...rows.map((r) => [r.email, r.status, r.name, r.source, r.subscribed_at, r.unsubscribed_at, r.consent_text]),
  ]);
  return new Response(`﻿${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="marketing-consents-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
