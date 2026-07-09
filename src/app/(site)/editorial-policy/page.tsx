import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How BOBR approaches reporting, accuracy, independence, and corrections.",
  alternates: { canonical: "https://basedbobr.com/editorial-policy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Editorial Policy</h1>
      <p className="mt-2 text-xs text-ink-soft">Last updated: July 2026</p>

      <p className="mt-6 text-base leading-relaxed text-ink-soft">
        BOBR is a builder-first crypto news desk. We cover Base blockchain, markets,
        on-chain culture, and guides for people who are here to build — not just trade.
        This document explains how we make editorial decisions and hold ourselves
        accountable.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="Mission">
          <p>
            Our goal is to inform builders, degens, and curious newcomers about what is
            happening in crypto — with honesty, context, and a little personality. We are
            not a price ticker. We are not financial advisors. We are a newsroom run by
            people who are still in the trenches.
          </p>
        </Section>

        <Section title="Editorial Independence">
          <p>
            BOBR editorial content is independent of our advertisers and sponsors.
            Advertising is sold separately from editorial decisions. No advertiser
            can buy a positive story, request changes to existing coverage, or
            influence what we choose to cover.
          </p>
          <p>
            Sponsored content (if any) is always clearly labelled as &quot;Sponsored&quot; or
            &quot;Paid&quot; and is distinct from our editorial articles.
          </p>
        </Section>

        <Section title="Accuracy & Corrections">
          <p>
            We strive to verify information before publishing. When we get something
            wrong, we correct it promptly and transparently — corrections are noted
            inline in the article with the date of the update.
          </p>
          <p>
            Found an error? Email us at{" "}
            <a href="mailto:0xshilloh@gmail.com" className="text-bobr-600 hover:underline">
              0xshilloh@gmail.com
            </a>{" "}
            with the article title and the correction, and we will review it within 48
            hours.
          </p>
        </Section>

        <Section title="Conflicts of Interest">
          <p>
            Writers and contributors may hold positions in cryptocurrencies or projects
            they write about. Where relevant, we disclose these holdings in the article.
            We do not write promotional content disguised as editorial coverage.
          </p>
        </Section>

        <Section title="Sources">
          <p>
            We use named sources where possible and clearly indicate when a source is
            anonymous and why. On-chain data is sourced directly from block explorers
            and indexed data providers. We link to primary sources wherever we can.
          </p>
        </Section>

        <Section title="Not Financial Advice">
          <p>
            Nothing published on BOBR constitutes financial, investment, or legal advice.
            Crypto markets are volatile and unregulated. Always do your own research
            (DYOR) before making any financial decision.
          </p>
        </Section>

        <Section title="Contact the Editorial Team">
          <p>
            Questions, tips, or concerns about our coverage? Reach us at{" "}
            <a href="mailto:0xshilloh@gmail.com" className="text-bobr-600 hover:underline">
              0xshilloh@gmail.com
            </a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
