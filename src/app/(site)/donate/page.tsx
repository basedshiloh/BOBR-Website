import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support BOBR — Mint BVERS NFT",
  description: "Support the BOBR project by minting a BVERS NFT on Base.",
  alternates: { canonical: "https://basedbobr.com/donate" },
};

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {/* Beaver icon */}
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-bobr-500 text-3xl">
        🦫
      </div>

      <h1 className="font-display text-4xl font-bold">Support BOBR</h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">
        BOBR runs on no VC money, no big team, and plenty of belief. If this site has
        been useful to you — or you just want to back the beaver — the best way to
        support us is to mint a <strong className="font-semibold text-ink">BVERS NFT</strong>.
      </p>

      <div className="my-10 rounded-md border border-rule bg-paper-card p-6 text-left">
        <h2 className="font-display text-xl font-semibold">What is BVERS?</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          BVERS is the Based BOBR NFT collection on Base. Minting one directly supports
          Shiloh and the BOBR community in keeping this news desk running, publishing
          builder-focused content, and refusing to fade.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Every mint goes to keeping the lights on — no middlemen, no protocol fees
          siphoned off. Just the community backing the builders.
        </p>

        <a
          href="https://mint.basedbobr.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-bobr-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
        >
          Mint BVERS NFT →
        </a>
      </div>

      <p className="text-xs text-ink-soft/60">
        Minting is done on Base. You&apos;ll need a compatible wallet (Coinbase Wallet,
        MetaMask, etc.) with ETH on Base to cover the mint and gas fees.
        This is not financial advice — DYOR, anon.
      </p>
    </div>
  );
}
