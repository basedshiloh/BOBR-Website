import Script from "next/script";
import Masthead from "@/components/site/Masthead";
import Footer from "@/components/site/Footer";
import AccessibilityPanel from "@/components/site/AccessibilityPanel";

// Layout for the public newspaper. The /polaris admin lives outside this group,
// so it keeps its own full-screen CMS shell.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Ad network — popunder */}
      <Script
        src="https://pl30392525.effectivecpmnetwork.com/0a/70/e7/0a70e74086b59f09463a871182386a01.js"
        strategy="afterInteractive"
      />
      {/* Ad network — social bar */}
      <Script
        src="https://pl30392526.effectivecpmnetwork.com/0f/8b/09/0f8b0994c87c84f52bc66c477ca530b6.js"
        strategy="afterInteractive"
      />
      <Masthead />
      <main className="flex-1">{children}</main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}
