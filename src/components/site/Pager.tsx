import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Simple page-number pager that keeps clean URLs: `${basePath}?page=N`.
export default function Pager({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-md border border-rule px-3 text-sm font-medium transition-colors";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={`${base} hover:border-bobr-300 hover:text-bobr-700`}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Link>
      ) : (
        <span className={`${base} opacity-40`}><ChevronLeft className="h-4 w-4" /> Prev</span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={href(page)}
          className={`${base} ${
            page === currentPage
              ? "border-bobr-600 bg-bobr-600 text-white"
              : "hover:border-bobr-300 hover:text-bobr-700"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={`${base} hover:border-bobr-300 hover:text-bobr-700`}>
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${base} opacity-40`}>Next <ChevronRight className="h-4 w-4" /></span>
      )}
    </nav>
  );
}
