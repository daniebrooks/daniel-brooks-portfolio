"use client";

import { useState, type SubmitEvent } from "react";
import { profile } from "./data";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "w-full rounded-lg border border-line bg-bg px-4 py-3 text-[0.95rem] text-bone placeholder:text-faint transition-colors focus-visible:border-accent/60";
const LABEL = "mb-2 block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint";

const messages: Record<string, string> = {
  rate_limited: "Too many messages from this connection. Please try again later.",
  invalid: "Please check your name, email, phone number, subject and message, then try again.",
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const data: { error?: string } = await res.json().catch(() => ({}));
      setError(
        data.error === "not_configured"
          ? `The form isn't set up yet. Please email ${profile.contact.email} directly.`
          : (data.error && messages[data.error]) ||
              `Something went wrong. Please email ${profile.contact.email} directly.`,
      );
    } catch {
      setError(`Network error. Please email ${profile.contact.email} directly.`);
    }
    setStatus("error");
  }

  return (
    <div id="contact-form" className="w-full rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-bone">Send a message</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Prefer a form to email? Tell me about your project and I’ll get back to you.
      </p>

      {status === "sent" ? (
        <div role="status" className="mt-8">
          <p className="text-bone">Message sent. Thanks, I’ll be in touch soon.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-5 rounded-full border border-line px-5 py-2.5 font-mono text-[0.78rem] text-bone transition-colors hover:border-accent/60 hover:text-accent"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-name" className={LABEL}>
                Name
              </label>
              <input
                id="cf-name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Your name"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="cf-email" className={LABEL}>
                Email
              </label>
              <input
                id="cf-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className={FIELD}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-phone" className={LABEL}>
                Phone number
              </label>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                maxLength={30}
                pattern="[+0-9 ()\-.]{7,30}"
                title="Digits only, with an optional + and spaces, dashes or brackets (7 to 15 digits)"
                autoComplete="tel"
                placeholder="+1 555 000 0000"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="cf-subject" className={LABEL}>
                Subject
              </label>
              <input
                id="cf-subject"
                name="subject"
                type="text"
                required
                maxLength={150}
                autoComplete="off"
                placeholder="What is this about?"
                className={FIELD}
              />
            </div>
          </div>
          <div>
            <label htmlFor="cf-message" className={LABEL}>
              Message
            </label>
            <textarea
              id="cf-message"
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              placeholder="What are you building?"
              className={`${FIELD} resize-y`}
            />
          </div>

          {/* honeypot: hidden from people and screen readers, bots tend to fill it */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="cf-company">Company</label>
            <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[0.8rem] font-semibold text-on-accent transition-[transform,opacity] duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message →"}
            </button>
            <p role="status" aria-live="polite" className="min-h-5 text-sm text-danger">
              {status === "error" ? error : ""}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
