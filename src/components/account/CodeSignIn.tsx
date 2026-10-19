"use client";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/primitives";
import { fieldClass, labelClass } from "@/components/ui/fields";
import { requestSignInCode, confirmSignInCode, type CodeResult } from "@/app/account/actions";

const FAILED: CodeResult = { ok: false, error: "Something went wrong. Please try again." };

/**
 * Email → 6-digit code → signed in. With `next`, the customer is sent on afterwards; without it
 * the current page re-renders with their details (the checkout).
 *
 * Deliberately not a <form>: at checkout it sits inside the order form, and a nested form is
 * invalid HTML. Enter is handled per field and never submits the order.
 */
export function CodeSignIn({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onEnter = (run: () => void) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    run();
  };

  async function send() {
    if (busy || !email) return;
    setBusy(true);
    setError("");
    const r = await requestSignInCode(email).catch(() => FAILED);
    setBusy(false);
    if (r.ok) setSent(true);
    else setError(r.error);
  }

  async function confirm(value: string) {
    if (busy || value.length !== 6) return;
    setBusy(true);
    setError("");
    const r = await confirmSignInCode(email, value).catch(() => FAILED);
    if (!r.ok) {
      setBusy(false);
      setError(r.error);
      return;
    }
    if (next) router.push(next);
    else router.refresh();
  }

  return (
    <div className="grid gap-3">
      {!sent ? (
        <div>
          <label className={labelClass} htmlFor="si-email">Email address</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onEnter(send)} aria-invalid={!!error} aria-describedby={error ? "si-error" : undefined} className={fieldClass} placeholder="you@example.com" />
            <Button type="button" onClick={send} disabled={busy || !email} className="shrink-0">{busy ? "Sending…" : "Email me a code"}</Button>
          </div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="si-code">We emailed a 6-digit code to {email}. It expires in 10 minutes.</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="si-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(v);
                if (v.length === 6) confirm(v);
              }}
              onKeyDown={onEnter(() => confirm(code))}
              aria-invalid={!!error}
              aria-describedby={error ? "si-error" : undefined}
              className={`${fieldClass} tnum tracking-[0.4em]`}
              placeholder="000000"
              autoFocus
            />
            <Button type="button" onClick={() => confirm(code)} disabled={busy || code.length !== 6} className="shrink-0">{busy ? "Checking…" : "Sign in"}</Button>
          </div>
          <button type="button" onClick={() => { setSent(false); setCode(""); setError(""); }} className="mt-2 text-xs text-stone-600 underline underline-offset-4">
            Use a different email, or send a new code
          </button>
        </div>
      )}
      {error && <p id="si-error" className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  );
}
