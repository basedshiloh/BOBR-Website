export default function AboutCard() {
  return (
    <section className="mt-8 rounded-md border border-rule bg-paper-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-bobr-500 text-xs"
          aria-hidden
        >
          🦫
        </span>
        <h2 className="kicker text-bobr-700">About BOBR</h2>
      </div>
      <div className="space-y-2.5 text-sm leading-relaxed text-ink-soft">
        <p>
          Based BOBR was a community-driven memecoin on the Base blockchain. It was
          inspired by <em>bobr kurwa</em> — a Polish phrase. We were supported by a
          bunch of figures such as Caitlyn Jenner, Rodney, and countless people I
          can&apos;t even name. We were one of the most successful projects in 2025.
        </p>
        <p>
          But a lot of things happened. The community slowly faded because Coinbase
          stopped supporting memecoins — they forced the Zora narrative that never
          worked — which led to misbelief in Base leadership and ended with people
          leaving the chain.
        </p>
        <p>
          Currently, Shiloh (Based BOBR dev) and a few BOBR community members
          refuse to die. We&apos;re reusing this website as a news, guide, and
          builder-focused outlet to help others build better on every chain.
        </p>
      </div>
    </section>
  );
}
