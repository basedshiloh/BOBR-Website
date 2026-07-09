import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies BOBR uses and how to control them.",
  alternates: { canonical: "https://basedbobr.com/cookie-policy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Cookie Policy</h1>
      <p className="mt-2 text-xs text-ink-soft">Last updated: July 2026</p>

      <p className="mt-6 text-base leading-relaxed text-ink-soft">
        Cookies are small text files stored in your browser. BOBR uses as few as
        possible — only what is strictly necessary to run the site.
      </p>

      <div className="mt-8 space-y-6">
        <Section title="Essential Cookies">
          <p>
            These cookies are required for the site to function. They cannot be
            disabled.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-rule">
                  <th className="py-2 pr-4 text-left font-semibold text-ink">Cookie</th>
                  <th className="py-2 pr-4 text-left font-semibold text-ink">Purpose</th>
                  <th className="py-2 text-left font-semibold text-ink">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                <tr>
                  <td className="py-2 pr-4 font-mono">polaris_session</td>
                  <td className="py-2 pr-4">CMS admin authentication. Only set if you log in to the CMS at <code>/polaris</code>.</td>
                  <td className="py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Analytics Cookies">
          <p>
            We currently do not use analytics cookies. If we add analytics in the future,
            this policy will be updated and you will be informed.
          </p>
        </Section>

        <Section title="Third-Party Cookies">
          <p>
            Some content embedded on BOBR (such as X / Twitter posts) may set cookies
            from those third-party platforms when the content loads. We do not control
            these cookies. Please refer to the relevant platform&apos;s cookie policy:
          </p>
          <ul className="list-disc pl-4">
            <li>
              <a
                href="https://help.twitter.com/en/rules-and-policies/twitter-cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bobr-600 hover:underline"
              >
                X (Twitter) Cookie Policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="How to Control Cookies">
          <p>
            You can control and delete cookies through your browser settings. Deleting
            essential cookies will log you out of the CMS if you are an admin.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-bobr-600 hover:underline">Chrome</a>
            </li>
            <li>
              <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-bobr-600 hover:underline">Firefox</a>
            </li>
            <li>
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-bobr-600 hover:underline">Safari</a>
            </li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            Questions about our cookie use?{" "}
            <a href="mailto:0xshilloh@gmail.com" className="text-bobr-600 hover:underline">
              0xshilloh@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
}
