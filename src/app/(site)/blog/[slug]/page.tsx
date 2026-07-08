import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPostBySlug, getRelatedPosts } from "@/cms/server/posts";
import { categoryStyle } from "@/cms/config";
import AuthorBox from "@/cms/components/blog/AuthorBox";
import SummaryBox from "@/cms/components/blog/SummaryBox";
import MarkdownRenderer from "@/cms/components/blog/MarkdownRenderer";
import RelatedPosts from "@/cms/components/blog/RelatedPosts";
import CommentSection from "@/cms/components/shared/CommentSection";
import JsonLd, { articleSchema, breadcrumbSchema } from "@/cms/components/seo/JsonLd";
import AdSlot from "@/cms/ads/AdSlot";
import { DesktopTOC, MobileTOC } from "@/components/site/TableOfContents";
import { CATEGORIES } from "@/lib/polaris.config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const primaryCategory = post.categories[0] || post.category;
  const related = await getRelatedPosts(slug, primaryCategory, 3);
  const cat = categoryStyle(CATEGORIES, primaryCategory);
  const url = `https://basedbobr.com/blog/${post.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.metaDescription || post.excerpt,
          url,
          datePublished: post.date,
          dateModified: post.updatedDate,
          authorName: post.author?.name,
          publisherName: "BOBR",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://basedbobr.com" },
          { name: cat.label, url: `https://basedbobr.com/${primaryCategory}` },
          { name: post.title, url },
        ])}
      />

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        {/* Article column */}
        <article className="mx-auto w-full max-w-[720px] xl:col-span-8">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-ink-soft">
            <Link href="/" className="hover:text-bobr-600">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/${primaryCategory}`} className="hover:text-bobr-600">{cat.label}</Link>
          </nav>

          <div className="flex flex-wrap gap-2">
            {post.categories.map(catKey => {
              const c = categoryStyle(CATEGORIES, catKey);
              return (
                <Link key={catKey} href={`/${catKey}`} className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${c.bg} ${c.text}`}>
                  {c.label}
                </Link>
              );
            })}
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 font-display text-lg italic leading-relaxed text-ink-soft">
              {post.excerpt}
            </p>
          )}

          <div className="mt-5">
            <AuthorBox
              author={post.author}
              date={post.date}
              readingTime={post.readingTime}
              updatedDate={post.updatedDate}
            />
          </div>

          {post.featuredImage && (
            <figure className="mt-6">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                width={960}
                height={540}
                priority
                className="w-full rounded-lg border border-rule"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </figure>
          )}

          {/* Ad — before content */}
          <AdSlot placement="post_before" />

          {post.summary?.length > 0 && (
            <div className="mt-6">
              <SummaryBox items={post.summary} />
            </div>
          )}

          {/* TOC — mobile only (desktop version lives in sidebar) */}
          <MobileTOC content={post.content} />

          <div className="mt-6">
            <MarkdownRenderer content={post.content} />
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-ink-soft"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Ad — after content */}
          <AdSlot placement="post_after" />

          <div className="mt-12 border-t border-rule pt-8">
            <RelatedPosts posts={related} categories={CATEGORIES} blogBasePath="/blog" />
          </div>

          <div className="mt-12 border-t border-rule pt-8">
            <CommentSection pageId={post.slug} pageType="blog" />
          </div>
        </article>

        {/* Sticky sidebar: TOC + ad (wide screens only) */}
        <aside className="hidden xl:col-span-4 xl:block">
          <div className="sticky top-6 space-y-6">
            <DesktopTOC content={post.content} />
            <AdSlot placement="post_sidebar" className="!my-0" />
          </div>
        </aside>
      </div>
    </div>
  );
}
