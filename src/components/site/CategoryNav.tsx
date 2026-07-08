import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/polaris.config";

// Horizontal beat nav under the masthead — newspaper section rail.
export default function CategoryNav() {
  return (
    <nav className="rule-t rule-b border-b border-rule">
      <ul className="mx-auto flex max-w-6xl items-center justify-center gap-x-6 px-4 py-2.5 overflow-x-auto scrollbar-none whitespace-nowrap">
        {CATEGORY_ORDER.map((key) => (
          <li key={key}>
            <Link
              href={`/${key}`}
              className="kicker text-ink-soft transition-colors hover:text-bobr-600"
            >
              {CATEGORIES[key].label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
