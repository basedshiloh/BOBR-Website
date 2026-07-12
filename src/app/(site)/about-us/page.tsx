import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BOBR",
  description:
    "BOBR started as a community-driven memecoin on Base. Today it's a builder-first crypto news desk run by Shiloh and a handful of holdouts who refused to fade.",
  alternates: { canonical: "https://basedbobr.com/about-us" },
};

function TeamCard({
  handle,
  name,
  role,
  bio,
}: {
  handle: string;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <div className="rounded-md border border-rule bg-paper-card p-5">
      <p className="kicker text-bobr-600">{handle}</p>
      <p className="mt-1 font-display text-xl font-semibold">{name}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-soft/70">{role}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{bio}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-bobr-500 text-3xl">
          🦫
        </div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">About BOBR</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          We started as a meme. We stayed as a movement.
        </p>
      </div>

      {/* Origin story */}
      <section className="mt-12 space-y-5 text-sm leading-relaxed text-ink-soft">
        <h2 className="font-display text-2xl font-bold text-ink">The story</h2>
        <p>
          Based BOBR was a community-driven memecoin on the Base blockchain. The name
          came from <em>bobr kurwa</em> — a Polish phrase that roughly translates to
          "beaver, f*** yeah." It was absurd, it was fun, and it caught on fast.
        </p>
        <p>
          We had real momentum. Caitlyn Jenner backed us. Rodney backed us. Countless
          others did too — people in the community who believed in something scrappy and
          community-first in a space full of VC-funded clones. For a while, BOBR was one
          of the most successful projects on Base in 2025.
        </p>
        <p>
          Then things shifted. Coinbase stopped supporting memecoins and pushed the Zora
          narrative — a forced pivot that never landed. People lost trust in the direction
          of the Base ecosystem. The community started to thin out. The chain got quieter.
        </p>
        <p>
          A lot of projects faded completely. We didn&apos;t.
        </p>
        <p>
          Shiloh (BOBR&apos;s dev) and a handful of community members decided that the
          energy, the relationships, and the voice BOBR had built were worth keeping
          alive — just pointed in a different direction. We turned this site into a
          builder-first news desk. Not price-chasing, not hype-driven — just honest
          coverage of what&apos;s happening in crypto, for the people who are actually
          building.
        </p>
      </section>

      {/* Mission */}
      <section className="mt-12 rounded-md border border-rule bg-paper-card p-6">
        <h2 className="font-display text-xl font-bold">What we stand for</h2>
        <ul className="mt-4 space-y-3">
          {[
            ["Builder-first", "We cover what matters to people who are building — not just people who are trading."],
            ["Chain-agnostic", "We started on Base, but we cover every chain. Good work is good work wherever it happens."],
            ["No fluff", "No paid shilling disguised as news. No hype without substance. DYOR always."],
            ["Community-driven", "BOBR was built by a community and it still is. If you have a tip, a story, or a take — reach out."],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bobr-500 text-[10px] text-white">✓</span>
              <span className="text-sm text-ink-soft"><strong className="font-semibold text-ink">{title} — </strong>{desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Team */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">The team</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Small team. Real people. All in the trenches.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <TeamCard
            handle="@0xshilloh"
            name="Shiloh"
            role="Founder & Dev"
            bio="Built BOBR from scratch. Former speaker for Based Druids and Ape Store. Still building when everyone else went home."
          />
          <TeamCard
            handle="@SOCryptooo"
            name="SO"
            role="Community Manager"
            bio="The Voice of BOBR. British, high-energy, and the reason people stuck around when things got hard."
          />
          <TeamCard
            handle="@defidoan"
            name="Kruger"
            role="Community & Strategy"
            bio="Deep in the trenches. Former Paradox. British voice, battle-hardened by crypto cycles."
          />
        </div>
      </section>

      {/* CTA row */}
      <section className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-full bg-bobr-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
        >
          Get in touch →
        </Link>
        <Link
          href="/services"
          className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-bobr-300 hover:text-bobr-700"
        >
          Work with us
        </Link>
        <Link
          href="/donate"
          className="rounded-full border border-rule px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-bobr-300 hover:text-bobr-700"
        >
          Support BOBR
        </Link>
      </section>
    </div>
  );
}
