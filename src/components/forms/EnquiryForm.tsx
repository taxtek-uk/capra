"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";
import { sourceMeta } from "@/lib/source";
import { cn, isPkPhone } from "@/lib/utils";
import { CONTACT } from "@/lib/brand";

type Kind = "contact" | "wholesale" | "product" | "warranty";

/** Contact and wholesale enquiries. Phone first (we reply on WhatsApp); email optional. */
export function EnquiryForm({ kind = "contact", subjects, dark }: { kind?: Kind; subjects?: string[]; dark?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [bad, setBad] = useState<{ name?: string; phone?: string; email?: string }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    const name = String(fd.get("name") ?? "").trim(), phone = String(fd.get("phone") ?? ""), email = String(fd.get("email") ?? "").trim();
    const found = {
      ...(name.length < 2 ? { name: "Please enter your name." } : {}),
      ...(!isPkPhone(phone) ? { phone: "Please enter a Pakistani number, e.g. 0300 1234567." } : {}),
      ...(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email: "Please enter a valid email, or leave it blank." } : {}),
    };
    setBad(found);
    const first = (["name", "phone", "email"] as const).find((k) => found[k]);
    if (first) { document.getElementById(`eq-${first}`)?.focus(); return; }
    setState("sending");
    const res = await fetch("/api/enquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(fd.entries()), kind, page: location.pathname, meta: sourceMeta() }) }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok && json?.ok) setState("done");
    else { setState("error"); setError(json?.error ?? `Something went wrong. Please WhatsApp ${CONTACT.whatsapp}.`); }
  }

  const field = cn("w-full rounded-xl border px-4 py-3 text-sm transition focus:border-ink-950", dark ? "border-bone-50/45 bg-bone-50/5 text-bone-50 placeholder:text-bone-100/60" : "border-ink-950/50 bg-bone-50 placeholder:text-stone-600");
  const label = cn("mb-1.5 block text-xs font-medium", dark ? "text-bone-100/70" : "text-stone-600");
  const opt = <span className={dark ? "text-bone-100/70" : "text-stone-600"}> (optional)</span>;
  const errorText = (id: string, msg?: string) => (msg ? <p id={id} className={cn("mt-1.5 text-xs", dark ? "text-[#f2a593]" : "text-danger")}>{msg}</p> : null);

  if (state === "done") {
    return (
      <div className={cn("rounded-2xl border p-8 text-center", dark ? "border-bone-50/15" : "border-ink-950/10")}>
        <p className="font-display text-2xl">Shukriya. We have your message.</p>
        <p className={cn("mt-2 text-sm", dark ? "text-bone-100/70" : "text-stone-600")}>We reply within one working day, usually on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate data-form={`enquiry-${kind}`}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={label} htmlFor="eq-name">Name</label><input id="eq-name" name="name" autoComplete="name" className={field} placeholder="Your name" aria-invalid={!!bad.name} aria-describedby={bad.name ? "eq-name-error" : undefined} />{errorText("eq-name-error", bad.name)}</div>
        <div><label className={label} htmlFor="eq-phone">Mobile / WhatsApp</label><input id="eq-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="0300 1234567" aria-invalid={!!bad.phone} aria-describedby={bad.phone ? "eq-phone-error" : undefined} />{errorText("eq-phone-error", bad.phone)}</div>
        <div><label className={label} htmlFor="eq-email">Email{opt}</label><input id="eq-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@example.com" aria-invalid={!!bad.email} aria-describedby={bad.email ? "eq-email-error" : undefined} />{errorText("eq-email-error", bad.email)}</div>
        <div><label className={label} htmlFor="eq-city">City{opt}</label><input id="eq-city" name="city" autoComplete="address-level2" className={field} placeholder="Lahore" /></div>
        {kind === "wholesale" && (
          <>
            <div><label className={label} htmlFor="eq-company">Shop or business{opt}</label><input id="eq-company" name="company" autoComplete="organization" className={field} placeholder="Business name" /></div>
            <div><label className={label} htmlFor="eq-quantity">Quantity{opt}</label><input id="eq-quantity" name="quantity" className={field} placeholder="e.g. 5 cartons, 200 pieces" /></div>
          </>
        )}
      </div>
      {subjects && (
        <div><label className={label} htmlFor="eq-subject">About</label><select id="eq-subject" name="subject" className={field} defaultValue={subjects[0]}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></div>
      )}
      <div><label className={label} htmlFor="eq-message">Message{opt}</label><textarea id="eq-message" name="message" rows={4} className={field} placeholder={kind === "wholesale" ? "Which models and sizes, and where you are." : "How can we help?"} /></div>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant={dark ? "brass" : "primary"} disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</Button>
        <p className={cn("text-xs", dark ? "text-bone-100/70" : "text-stone-600")}>We reply within one working day.</p>
      </div>
    </form>
  );
}
