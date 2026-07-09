import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Community Manager Service — Real Voices, Real Results",
  description:
    "BOBR offers professional crypto community management starting at $1,500/mo. British voices, VC hosting, bull posting, and project linkups. Not bots — real people from the trenches.",
  alternates: { canonical: "https://basedbobr.com/services/crypto-community-manager" },
  keywords: [
    "crypto community manager",
    "NFT community manager",
    "web3 community manager",
    "crypto community management",
    "Base blockchain community",
    "crypto project community",
    "crypto VC host",
    "crypto bull posting",
  ],
};

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

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-t border-rule pt-5">
      <h3 className="font-display text-base font-semibold">{question}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{answer}</p>
    </div>
  );
}

export default function CryptoCommunityManagerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-ink-soft">
        <Link href="/" className="hover:text-bobr-600">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/services" className="hover:text-bobr-600">Services</Link>
        <span className="mx-1.5">/</span>
        <span>Crypto Community Manager</span>
      </nav>

      {/* Hero */}
      <div className="rounded-md border border-rule bg-paper-card p-8 text-center">
        <span className="inline-block rounded-full bg-bobr-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-bobr-700">
          Community Service
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
          Crypto Community Manager
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          Got a project but no real voice? BOBR handles your community — with people
          who actually live in the trenches, not hired bots or scripted responses.
        </p>
        <p className="mt-4 font-display text-2xl font-bold text-bobr-600">
          From $1,500 / month
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
          >
            Talk to us →
          </Link>
        </div>
      </div>

      {/* Why BOBR */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Why BOBR?</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Most crypto community managers are either bots, offshore agencies reading from
          a script, or KOLs who charge more and deliver less. BOBR is none of those
          things. We are a small team of people who built real communities from scratch —
          in voice chats, on X, and in the trenches of crypto Twitter. We don&apos;t just
          manage communities; we become part of them.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-display text-2xl">🎙️</p>
            <p className="mt-2 font-semibold">Real Voices</p>
            <p className="mt-1 text-sm text-ink-soft">
              British voices that command attention in X Spaces and voice chats.
              Signature personalities — not generic CMs.
            </p>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-display text-2xl">⚡</p>
            <p className="mt-2 font-semibold">Better Than KOLs</p>
            <p className="mt-1 text-sm text-ink-soft">
              KOLs charge more for a single post. We charge less and stay — posting,
              hosting, and building every week.
            </p>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-display text-2xl">🔗</p>
            <p className="mt-2 font-semibold">Trenches-Tested</p>
            <p className="mt-1 text-sm text-ink-soft">
              Built and grew BOBR from zero. We know what works and what doesn&apos;t
              inside crypto communities.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">The team</h2>
        <p className="mt-2 text-sm text-ink-soft">
          You&apos;re not hiring a faceless agency — you&apos;re working with real people.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="kicker text-bobr-600">@0xshilloh</p>
            <p className="mt-1 font-display text-xl font-semibold">Shiloh</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              BOBR Dev and founder. Former speaker for Based Druids and Ape Store.
              Builder, strategist, and the brain behind the brand.
            </p>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="kicker text-bobr-600">@SOCryptooo</p>
            <p className="mt-1 font-display text-xl font-semibold">SO</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Based BOBR Community Manager and the Voice of BOBR. British, high-energy,
              and the kind of CM that actually brings people in and keeps them there.
            </p>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="kicker text-bobr-600">@defidoan</p>
            <p className="mt-1 font-display text-xl font-semibold">Kruger</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Deep in the trenches. Former Paradox. British voice, battle-hardened by
              crypto cycles, and someone who knows how to hold a community together
              when things get rough.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Pricing</h2>
        <p className="mt-2 text-sm text-ink-soft">
          All plans are monthly. No lock-in — just results.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Starter */}
          <div className="flex flex-col rounded-md border border-rule bg-paper-card p-5">
            <p className="kicker text-ink-soft/60">Starter</p>
            <p className="mt-2 font-display text-3xl font-black">
              $1,500<span className="text-base font-normal text-ink-soft">/mo</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              <FeatureItem>1 VC every 2 weeks</FeatureItem>
              <FeatureItem>Bull posting 3× per week per account</FeatureItem>
              <FeatureItem>Active community presence on X</FeatureItem>
              <FeatureItem>Monthly performance recap</FeatureItem>
            </ul>
            <a
              href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Starter%20%241%2C500"
              className="mt-6 block rounded-full border border-bobr-300 px-4 py-2.5 text-center text-sm font-semibold text-bobr-700 transition-colors hover:bg-bobr-50"
            >
              Get started
            </a>
          </div>

          {/* Growth */}
          <div className="flex flex-col rounded-md border-2 border-bobr-400 bg-paper-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="kicker text-bobr-600">Growth</p>
              <span className="rounded-full bg-bobr-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Popular
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-black">
              $2,000<span className="text-base font-normal text-ink-soft">/mo</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              <FeatureItem>1 VC every week</FeatureItem>
              <FeatureItem>Bull posting 5× per week per account</FeatureItem>
              <FeatureItem>Active community presence on X</FeatureItem>
              <FeatureItem>Monthly performance recap</FeatureItem>
            </ul>
            <a
              href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Growth%20%242%2C000"
              className="mt-6 block rounded-full bg-bobr-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
            >
              Get started
            </a>
          </div>

          {/* Full Send */}
          <div className="flex flex-col rounded-md border border-rule bg-paper-card p-5">
            <p className="kicker text-ink-soft/60">Full Send</p>
            <p className="mt-2 font-display text-3xl font-black">
              $3,000<span className="text-base font-normal text-ink-soft">/mo</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              <FeatureItem>2 VCs per week</FeatureItem>
              <FeatureItem>Bull posting daily per account</FeatureItem>
              <FeatureItem>Linkups with other projects & investors</FeatureItem>
              <FeatureItem>Space collaborations with other communities</FeatureItem>
              <FeatureItem>Full community growth strategy</FeatureItem>
            </ul>
            <a
              href="mailto:0xshilloh@gmail.com?subject=Community%20Manager%20-%20Full%20Send%20%243%2C000"
              className="mt-6 block rounded-full border border-bobr-300 px-4 py-2.5 text-center text-sm font-semibold text-bobr-700 transition-colors hover:bg-bobr-50"
            >
              Get started
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-5">
          <FAQ
            question="What is a VC in crypto community management?"
            answer="VC stands for Voice Chat — a live audio session on X Spaces or Discord where we represent your project, talk about what you're building, and engage with your community and potential new members directly."
          />
          <FAQ
            question="What is bull posting?"
            answer="Bull posting is consistent, high-energy promotion of your project on X (Twitter) — sharing updates, hyping milestones, engaging with replies, and keeping your project visible in people's feeds. It's organic social presence, not bot activity."
          />
          <FAQ
            question="Which accounts post on behalf of my project?"
            answer="SO (@SOCryptooo) and Kruger (@defidoan) are the primary community voices. Shiloh (@0xshilloh) is involved in strategy and higher-tier plans."
          />
          <FAQ
            question="Do you post from your own accounts or mine?"
            answer="We post from our own accounts as advocates for your project, which carries more credibility than posts from an official brand account. We can also support your own account with content and strategy."
          />
          <FAQ
            question="Can I start with a trial?"
            answer="Yes — reach out and we can discuss a short-term trial arrangement before committing to a monthly plan."
          />
          <FAQ
            question="What projects have you worked with before?"
            answer="BOBR's team has experience in Base Druids, Ape Store, Paradox, and the BOBR community itself. We've been around long enough to know what builds a lasting community and what burns it."
          />
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 rounded-md border border-rule bg-paper-card p-8 text-center">
        <h2 className="font-display text-2xl font-bold">
          Ready for a community that actually converts?
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Tell us about your project and we&apos;ll find the right plan together.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
        >
          Get in touch →
        </Link>
      </div>
    </div>
  );
}
