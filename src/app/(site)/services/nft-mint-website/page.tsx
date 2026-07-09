import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFT Mint Website Development — Custom, Modern & Fully Deployable",
  description:
    "BOBR builds custom NFT mint websites starting at $500. Modern design, EVM-compatible, wallet-ready. Deployable on Vercel or self-hosted via Coolify. See a live example at mint.basedbobr.com.",
  alternates: { canonical: "https://basedbobr.com/services/nft-mint-website" },
  keywords: [
    "NFT mint website",
    "NFT minting page",
    "custom NFT website",
    "NFT mint site development",
    "Base chain NFT mint",
    "EVM NFT mint website",
    "NFT launch website",
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

export default function NftMintWebsitePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs text-ink-soft">
        <Link href="/" className="hover:text-bobr-600">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/services" className="hover:text-bobr-600">Services</Link>
        <span className="mx-1.5">/</span>
        <span>NFT Mint Website</span>
      </nav>

      {/* Hero */}
      <div className="rounded-md border border-rule bg-paper-card p-8 text-center">
        <span className="inline-block rounded-full bg-bobr-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-bobr-700">
          Development Service
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
          NFT Mint Website
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
          A fully customisable, modern NFT mint site — built for your project,
          branded your way, and ready to launch fast.
        </p>
        <div className="mt-6">
          <p className="font-display text-5xl font-black text-bobr-600">$500</p>
          <p className="mt-1 text-sm text-ink-soft">one-time fee · hosting not included</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
          >
            Get started →
          </Link>
          <a
            href="https://mint.basedbobr.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-rule bg-paper px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-bobr-300 hover:text-bobr-700"
          >
            See live example →
          </a>
        </div>
      </div>

      {/* What's included */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">What&apos;s included</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Everything you need to launch a professional mint experience — no extras, no hidden fees.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-semibold">Design & Branding</p>
            <ul className="mt-3 space-y-2">
              <FeatureItem>Your colours, fonts, and logo</FeatureItem>
              <FeatureItem>Custom mint button and progress bar</FeatureItem>
              <FeatureItem>Live supply and mint count display</FeatureItem>
              <FeatureItem>Mobile-first, fully responsive</FeatureItem>
            </ul>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-semibold">Technical Build</p>
            <ul className="mt-3 space-y-2">
              <FeatureItem>Next.js frontend — fast and SEO-friendly</FeatureItem>
              <FeatureItem>wagmi + RainbowKit wallet connection</FeatureItem>
              <FeatureItem>Works on any EVM chain (Base, ETH, and more)</FeatureItem>
              <FeatureItem>Smart contract integration</FeatureItem>
            </ul>
          </div>
          <div className="rounded-md border border-rule bg-paper-card p-5">
            <p className="font-semibold">Hosting & Launch</p>
            <ul className="mt-3 space-y-2">
              <FeatureItem>We help you find and set up hosting</FeatureItem>
              <FeatureItem>Deploy on Vercel (free tier available)</FeatureItem>
              <FeatureItem>Or self-host via Coolify for full control</FeatureItem>
              <FeatureItem>Post-launch support included</FeatureItem>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <ol className="mt-6 space-y-4">
          {[
            ["Brief us", "Tell us about your project — your contract address, chain, branding assets, and how you want the mint page to look and feel."],
            ["We build", "We put together the mint site using your brief. You'll get a preview to review and approve before anything goes live."],
            ["You review", "We go through as many revision rounds as needed until you're happy. No rushing, no cutting corners."],
            ["We launch", "We deploy to your domain and help you set up hosting. You're live — go make noise about it."],
          ].map(([step, desc], i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-3xl font-black leading-none text-bobr-200">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold">{step}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Live example callout */}
      <section className="mt-14 rounded-md border border-bobr-200 bg-bobr-50 p-6">
        <h2 className="font-display text-xl font-bold">See it in action</h2>
        <p className="mt-2 text-sm leading-relaxed text-bobr-800">
          <a
            href="https://mint.basedbobr.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-bobr-600"
          >
            mint.basedbobr.com
          </a>{" "}
          is our own NFT mint site — built with the same stack and the same process
          we use for every client. What you see there is what you get.
        </p>
      </section>

      {/* FAQs */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-5">
          <FAQ
            question="Do I need a deployed smart contract first?"
            answer="Yes — we integrate your existing contract into the mint site. If you don't have a contract yet, we can point you to trusted developers, but contract development is not included in the $500 fee."
          />
          <FAQ
            question="Which blockchains do you support?"
            answer="Any EVM-compatible chain: Base, Ethereum, Optimism, Arbitrum, Polygon, and others. Base is our home turf, so that's where we're fastest."
          />
          <FAQ
            question="What do I need to provide?"
            answer="Your contract address and ABI, chain, branding assets (logo, colours, imagery), domain name, and any copy you want on the page. We'll guide you through everything else."
          />
          <FAQ
            question="How long does it take?"
            answer="Typically 3–7 days from brief to launch, depending on complexity and how quickly you can provide assets and feedback."
          />
          <FAQ
            question="What hosting options are there?"
            answer="We recommend Vercel for simplicity (free tier covers most mint sites) or Coolify if you want full server control. We'll help you set up whichever you choose — hosting costs are separate from our build fee."
          />
          <FAQ
            question="Can I update the site after launch?"
            answer="Yes. The codebase is yours. We can also handle updates for a small fee if you'd rather not touch the code yourself."
          />
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 rounded-md border border-rule bg-paper-card p-8 text-center">
        <h2 className="font-display text-2xl font-bold">Ready to launch your mint?</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Email us with your project details and we&apos;ll get back to you within 48 hours.
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
