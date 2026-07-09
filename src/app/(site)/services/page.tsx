import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "BOBR offers NFT mint website development and professional community management for crypto projects.",
  alternates: { canonical: "https://basedbobr.com/services" },
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-bobr-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-bobr-700">
      {children}
    </span>
  );
}

function Check() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bobr-500 text-[10px] text-white">
      ✓
    </span>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-ink-soft">
      <Check />
      <span>{children}</span>
    </li>
  );
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <Badge>What we offer</Badge>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Services
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          We build in the trenches. If you need a mint site or a real community
          voice — not a bot farm, not a cheap agency — BOBR delivers.
        </p>
      </div>

      <div className="mt-16 space-y-20">
        {/* ── SERVICE 1: NFT Mint Website ── */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge>Service 01</Badge>
              <h2 className="mt-3 font-display text-3xl font-bold">
                NFT Mint Website
              </h2>
              <p className="mt-2 max-w-lg text-base leading-relaxed text-ink-soft">
                A fully customisable, modern NFT mint site — built for your
                project, branded your way, and ready to launch. We handle the
                build; you handle the hype.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-4xl font-black text-bobr-600">$500</p>
              <p className="text-xs text-ink-soft">one-time · excl. hosting</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="font-semibold">Fully Customisable</p>
              <ul className="mt-3 space-y-2">
                <FeatureItem>Your branding, colours, and fonts</FeatureItem>
                <FeatureItem>Custom mint button, progress bar, and supply counter</FeatureItem>
                <FeatureItem>Mobile-first, responsive design</FeatureItem>
              </ul>
            </div>
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="font-semibold">Modern Tech Stack</p>
              <ul className="mt-3 space-y-2">
                <FeatureItem>Next.js + wagmi / RainbowKit wallet integration</FeatureItem>
                <FeatureItem>Works on any EVM chain (Base, ETH, others)</FeatureItem>
                <FeatureItem>Fast, SEO-friendly, and lightweight</FeatureItem>
              </ul>
            </div>
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="font-semibold">Hosting & Launch</p>
              <ul className="mt-3 space-y-2">
                <FeatureItem>We help you find and set up your server</FeatureItem>
                <FeatureItem>Deploy on Vercel or self-host via Coolify</FeatureItem>
                <FeatureItem>Post-launch support included</FeatureItem>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-bobr-200 bg-bobr-50 p-4 text-sm text-bobr-800">
            <strong>Want to see an example?</strong> Check out{" "}
            <a
              href="https://mint.basedbobr.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-bobr-600"
            >
              mint.basedbobr.com
            </a>{" "}
            — our own mint site, built with the same stack.
          </div>

          <div className="mt-6">
            <Link
              href="/contact?subject=NFT+Mint+Website"
              className="inline-block rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
            >
              Get in touch →
            </Link>
          </div>
        </section>

        <div className="border-t border-rule" />

        {/* ── SERVICE 2: Community Manager ── */}
        <section>
          <div>
            <Badge>Service 02</Badge>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Community Manager
            </h2>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-soft">
              Got a project but no real voice? BOBR will handle it. We&apos;re not
              a bot farm or a cheap agency. We&apos;re people who live in the
              trenches — and it shows.
            </p>
          </div>

          {/* Team */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="kicker text-bobr-600">@0xshilloh</p>
              <p className="mt-1 font-display text-lg font-semibold">Shiloh</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                BOBR Dev. Former speaker for Based Druids and Ape Store. The
                builder behind the brand.
              </p>
            </div>
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="kicker text-bobr-600">@SOCryptooo</p>
              <p className="mt-1 font-display text-lg font-semibold">SO</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Based BOBR Community Manager and Voice of BOBR. British accent,
                signature energy — the kind that actually attracts people.
              </p>
            </div>
            <div className="rounded-md border border-rule bg-paper-card p-5">
              <p className="kicker text-bobr-600">@defidoan</p>
              <p className="mt-1 font-display text-lg font-semibold">Kruger</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Deep in the trenches. Former Paradox. British voice, battle-tested
                in the grind.
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
            SO and Kruger are both British with signature voices that cut through
            the noise. We don&apos;t just show up as community members — we act
            better than your KOLs. Most KOLs ask more and deliver less. With
            BOBR, you get people who will genuinely handle your community.
          </p>

          {/* Pricing tiers */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* Tier 1 */}
            <div className="flex flex-col rounded-md border border-rule bg-paper-card p-5">
              <p className="kicker text-ink-soft/60">Starter</p>
              <p className="mt-2 font-display text-3xl font-black">$1,500<span className="text-base font-normal text-ink-soft">/mo</span></p>
              <ul className="mt-4 flex-1 space-y-2">
                <FeatureItem>1 VC every 2 weeks</FeatureItem>
                <FeatureItem>Bull posting 3× per week per account</FeatureItem>
                <FeatureItem>Active community presence</FeatureItem>
              </ul>
              <a
                href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Starter%20%241%2C500"
                className="mt-6 block rounded-full border border-bobr-300 px-4 py-2 text-center text-sm font-semibold text-bobr-700 transition-colors hover:bg-bobr-50"
              >
                Get started
              </a>
            </div>

            {/* Tier 2 */}
            <div className="flex flex-col rounded-md border-2 border-bobr-400 bg-paper-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="kicker text-bobr-600">Growth</p>
                <span className="rounded-full bg-bobr-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Popular</span>
              </div>
              <p className="mt-2 font-display text-3xl font-black">$2,000<span className="text-base font-normal text-ink-soft">/mo</span></p>
              <ul className="mt-4 flex-1 space-y-2">
                <FeatureItem>1 VC every week</FeatureItem>
                <FeatureItem>Bull posting 5× per week per account</FeatureItem>
                <FeatureItem>Active community presence</FeatureItem>
              </ul>
              <a
                href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Growth%20%242%2C000"
                className="mt-6 block rounded-full bg-bobr-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
              >
                Get started
              </a>
            </div>

            {/* Tier 3 */}
            <div className="flex flex-col rounded-md border border-rule bg-paper-card p-5">
              <p className="kicker text-ink-soft/60">Full Send</p>
              <p className="mt-2 font-display text-3xl font-black">$3,000<span className="text-base font-normal text-ink-soft">/mo</span></p>
              <ul className="mt-4 flex-1 space-y-2">
                <FeatureItem>2 VCs per week</FeatureItem>
                <FeatureItem>Bull posting daily per account</FeatureItem>
                <FeatureItem>Linkups with other projects, investors & spaces</FeatureItem>
                <FeatureItem>Full community strategy & growth</FeatureItem>
              </ul>
              <a
                href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Full%20Send%20%243%2C000"
                className="mt-6 block rounded-full border border-bobr-300 px-4 py-2 text-center text-sm font-semibold text-bobr-700 transition-colors hover:bg-bobr-50"
              >
                Get started
              </a>
            </div>
          </div>

          <p className="mt-6 text-xs text-ink-soft/60">
            All plans are monthly. Reach out to discuss custom arrangements or
            trial periods.
          </p>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="mt-20 rounded-md border border-rule bg-paper-card p-8 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-bobr-500 text-2xl">
          🦫
        </div>
        <h2 className="font-display text-2xl font-bold">Ready to build together?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Drop us an email and we&apos;ll get back to you within 48 hours.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
        >
          Contact us →
        </Link>
      </div>
    </div>
  );
}
