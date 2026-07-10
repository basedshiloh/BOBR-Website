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
      <Masthead />
      <main className="flex-1">{children}</main>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}
