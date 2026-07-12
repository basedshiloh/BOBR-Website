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
import JsonLd, { breadcrumbSchema } from "@/cms/components/seo/JsonLd";
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
  const canonicalUrl = `https://basedbobr.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.tags?.join(", ") || undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate,
      authors: post.author?.name ? [post.author.name] : undefined,
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
  const categoryUrl = `https://basedbobr.com/${primaryCategory}`;
  const description = post.metaDescription || post.excerpt || "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* NewsArticle schema — more specific than Article, eligible for Google News */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": post.title,
        "description": description,
        "url": url,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        ...(post.date ? { "datePublished": post.date } : {}),
        ...(post.updatedDate ? { "dateModified": post.updatedDate } : {}),
        "author": {
          "@type": "Person",
          "name": post.author?.name || "BOBR Editorial",
          ...(post.author?.name ? { "url": "https://basedbobr.com/about-us" } : {}),
        },
        "publisher": {
          "@type": "Organization",
          "name": "BOBR",
          "url": "https://basedbobr.com/",
        },
        ...(post.featuredImage ? { "image": { "@type": "ImageObject", "url": post.featuredImage } } : {}),
        "articleSection": cat.label,
        ...(post.tags?.length ? { "keywords": post.tags.join(", ") } : {}),
        "isAccessibleForFree": true,
        "inLanguage": "en-US",
      }} />

      {/* Breadcrumb schema */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://basedbobr.com/" },
          { name: "Blog", url: "https://basedbobr.com/blog" },
          { name: cat.label, url: categoryUrl },
          { name: post.title, url },
        ])}
      />

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        {/* Article column */}
        <article className="mx-auto w-full max-w-[720px] xl:col-span-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink-soft">
            <Link href="/" className="hover:text-bobr-600">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-bobr-600">Blog</Link>
            <span aria-hidden>/</span>
            <Link href={`/${primaryCategory}`} className="hover:text-bobr-600">{cat.label}</Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="max-w-[200px] truncate text-ink sm:max-w-xs">
              {post.title}
            </span>
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
