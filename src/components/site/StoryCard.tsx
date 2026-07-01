import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/cms/types";
import { categoryStyle } from "@/cms/config";
import { CATEGORIES } from "@/lib/polaris.config";

type Variant = "lead" | "feature" | "compact";

function CategoryTag({ category }: { category: string }) {
  const s = categoryStyle(CATEGORIES, category);
  return (
    <Link
      href={`/${category}`}
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${s.bg} ${s.text}`}
    >
      {s.label}
    </Link>
  );
}

function Meta({ post }: { post: Post }) {
  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  return (
    <p className="mt-2 text-xs text-ink-soft/70">
      {post.author?.name ? <span>{post.author.name}</span> : null}
      {date && <span> · {date}</span>}
      {post.readingTime ? <span> · {post.readingTime} min</span> : null}
    </p>
  );
}

function Cover({ post, priority = false }: { post: Post; priority?: boolean }) {
  const href = `/blog/${post.slug}`;
  if (!post.featuredImage) {
    return (
      <Link
        href={href}
        className="block aspect-[16/9] w-full rounded-md border border-rule bg-gradient-to-br from-bobr-100 to-bobr-300"
        aria-hidden
      />
    );
  }
  return (
    <Link href={href} className="block overflow-hidden rounded-md border border-rule">
      <Image
        src={post.featuredImage}
        alt={post.featuredImageAlt || post.title}
        width={800}
        height={450}
        priority={priority}
        className="aspect-[16/9] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        sizes="(max-width: 768px) 100vw, 640px"
      />
    </Link>
  );
}

export default function StoryCard({
  post,
  variant = "feature",
  priority = false,
}: {
  post: Post;
  variant?: Variant;
  priority?: boolean;
}) {
  const href = `/blog/${post.slug}`;

  if (variant === "compact") {
    return (
      <article className="py-3">
        <CategoryTag category={post.category} />
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">
          <Link href={href} className="transition-colors hover:text-bobr-700">
            {post.title}
          </Link>
        </h3>
        <Meta post={post} />
      </article>
    );
  }

  if (variant === "lead") {
    return (
      <article>
        <Cover post={post} priority={priority} />
        <div className="mt-3">
          <CategoryTag category={post.category} />
          <h2 className="mt-2 font-display text-3xl font-bold leading-[1.1] sm:text-4xl">
            <Link href={href} className="transition-colors hover:text-bobr-700">
              {post.title}
            </Link>
          </h2>
          {post.excerpt && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
              {post.excerpt}
            </p>
          )}
          <Meta post={post} />
        </div>
      </article>
    );
  }

  // feature
  return (
    <article>
      <Cover post={post} priority={priority} />
      <div className="mt-3">
        <CategoryTag category={post.category} />
        <h3 className="mt-1.5 font-display text-xl font-bold leading-snug">
          <Link href={href} className="transition-colors hover:text-bobr-700">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {post.excerpt}
          </p>
        )}
        <Meta post={post} />
      </div>
    </article>
  );
}
