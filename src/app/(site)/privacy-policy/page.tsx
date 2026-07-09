import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BOBR collects, uses, and protects your data.",
  alternates: { canonical: "https://basedbobr.com/privacy-policy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-xs text-ink-soft">Last updated: July 2026</p>

      <p className="mt-6 text-base leading-relaxed text-ink-soft">
        BOBR (<em>basedbobr.com</em>) respects your privacy. This policy explains what
        data we collect, how we use it, and your rights around it. We keep it simple
        because we collect very little.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="What We Collect">
          <p>
            <strong className="font-semibold text-ink">Comments.</strong> If you leave a
            comment on an article, we store your display name and the comment text.
            We do not require an email address or account to comment.
          </p>
          <p>
            <strong className="font-semibold text-ink">Contact emails.</strong> If you
            email us directly, we store your email address and message only to reply to
            you. We do not add you to any mailing list.
          </p>
          <p>
            <strong className="font-semibold text-ink">Basic server logs.</strong> Like
            any web server, we log IP addresses and page requests. These logs are used
            only for debugging and are not shared with third parties.
          </p>
        </Section>

        <Section title="What We Do Not Collect">
          <p>
            We do not run invasive analytics, sell data to advertisers, or build user
            profiles. We do not use Facebook Pixel, Google Analytics, or similar
            tracking tools.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use a small number of essential cookies — see our{" "}
            <a href="/cookie-policy" className="text-bobr-600 hover:underline">
              Cookie Policy
            </a>{" "}
            for details. We do not use tracking or advertising cookies.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            Our site may embed third-party content such as X (Twitter) posts. These
            embeds are served by third parties and may set their own cookies. We have no
            control over their data practices.
          </p>
          <p>
            Advertising partners who serve ads on BOBR may also use cookies. Please refer
            to their individual privacy policies for details.
          </p>
        </Section>

        <Section title="Data Retention & Deletion">
          <p>
            We retain comment data indefinitely unless you request deletion. Server logs
            are rotated regularly. To request deletion of your data, email us at{" "}
            <a href="mailto:0xshilloh@gmail.com" className="text-bobr-600 hover:underline">
              0xshilloh@gmail.com
            </a>.
          </p>
        </Section>

        <Section title="Children">
          <p>
            BOBR is not directed at children under 13. We do not knowingly collect data
            from children.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this policy from time to time. The &quot;last updated&quot; date at the
            top of this page reflects when it was last changed. Continued use of the site
            after a change constitutes acceptance of the new policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about your privacy?{" "}
            <a href="mailto:0xshilloh@gmail.com" className="text-bobr-600 hover:underline">
              0xshilloh@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
}
