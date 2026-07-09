import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the BOBR team — tips, advertising, or just to say hi.",
  alternates: { canonical: "https://basedbobr.com/contact" },
};

function ContactCard({
  title,
  description,
  action,
  href,
  external = false,
}: {
  title: string;
  description: string;
  action: string;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="rounded-md border border-rule bg-paper-card p-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="mt-4 inline-block rounded-full bg-bobr-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-bobr-700"
      >
        {action}
      </a>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Contact</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-soft">
        Have a tip, a question, or want to work with BOBR? Pick the right channel below
        and we&apos;ll get back to you.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ContactCard
          title="Tips & Story Ideas"
          description="Spotted something happening in the Base ecosystem or on-chain? Send us your tip or story idea and we'll look into it."
          action="Send a tip →"
          href="mailto:0xshilloh@gmail.com?subject=Tip%3A%20"
        />
        <ContactCard
          title="General Inquiries"
          description="Questions about BOBR, the site, or the community? Reach out and we'll respond as soon as we can."
          action="Send an email →"
          href="mailto:0xshilloh@gmail.com"
        />
        <ContactCard
          title="Advertising & Sponsorship"
          description="Interested in a banner placement, a sponsored guide, or a partnership? Let's talk — we keep it transparent and builder-friendly."
          action="Get in touch →"
          href="mailto:0xshilloh@gmail.com?subject=Advertising%20inquiry"
        />
        <ContactCard
          title="Support the Project"
          description="BOBR runs without VC money or a big team. If you want to keep the lights on, you can mint a BVERS NFT to support us directly."
          action="Mint BVERS NFT →"
          href="https://mint.basedbobr.com/"
          external
        />
      </div>

      <div className="mt-10 rounded-md border border-rule bg-paper-card p-5">
        <p className="kicker mb-1 text-ink-soft/60">Direct email</p>
        <a
          href="mailto:0xshilloh@gmail.com"
          className="font-display text-xl font-semibold text-bobr-600 hover:underline"
        >
          0xshilloh@gmail.com
        </a>
        <p className="mt-1 text-sm text-ink-soft">
          We try to respond within 48 hours.
        </p>
      </div>
    </div>
  );
}
