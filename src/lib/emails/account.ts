/** The sign-in code email. Short on purpose: the code is the whole message. */
import { emailShell, panel } from "@/lib/email";
import { BRAND } from "@/lib/brand";
import { escapeHtml } from "@/lib/utils";
import { CODE_TTL_SECONDS } from "@/lib/customer";

export function buildCodeEmail(code: string) {
  const c = escapeHtml(code);
  const minutes = CODE_TTL_SECONDS / 60;
  return {
    subject: `${c} is your ${BRAND.name} sign-in code`,
    html: emailShell(
      "Your sign-in code",
      `<p style="margin:22px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Enter this code to sign in to your ${BRAND.name} account. It works once and expires in ${minutes} minutes.</p>
<p style="margin:22px 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:38px;letter-spacing:.3em;color:#0b0a09">${c}</p>
${panel("If you did not ask for this code, you can ignore this email. Nobody can sign in without it.")}`,
      { preheader: `Your code is ${c}. It expires in ${minutes} minutes.` },
    ),
  };
}
