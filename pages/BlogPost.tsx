import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../lib/supabase";

type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  status: "draft" | "published" | "archived";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};

type SlugRow = Pick<BlogPostRecord, "slug" | "title" | "published_at">;

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadingMinutes(markdown: string | null) {
  if (!markdown) return 1;
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}

// --- helpers (same idea as BlogIndex) ---
function upsertMetaDescription(content: string) {
  let el = document.querySelector(
    'meta[name="description"]',
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "description");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertMetaProperty(property: string, content: string) {
  let el = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaName(name: string, content: string) {
  let el = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertJsonLd(id: string, json: unknown) {
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  const el = existing ?? document.createElement("script");
  el.type = "application/ld+json";
  el.id = id;
  el.textContent = JSON.stringify(json);
  if (!existing) document.head.appendChild(el);
}

function removeHeadNode(selector: string) {
  const el = document.querySelector(selector);
  if (el) el.remove();
}

async function fetchPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[blog] fetchPostBySlug error:", error);
    throw error;
  }
  return (data as BlogPostRecord) ?? null;
}

async function fetchPublishedSlugs(): Promise<SlugRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug,title,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[blog] fetchPublishedSlugs error:", error);
    // list is non-critical; return empty instead of throwing
    return [];
  }
  return (data ?? []) as SlugRow[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [list, setList] = useState<SlugRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load post + list
  useEffect(() => {
    let alive = true;

    async function run() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      setNotFound(false);
      setPost(null);

      try {
        const [p, l] = await Promise.all([
          fetchPostBySlug(slug),
          fetchPublishedSlugs(),
        ]);

        if (!alive) return;

        if (!p) {
          setNotFound(true);
          setList(l);
          setLoading(false);
          return;
        }

        setPost(p);
        setList(l);
        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        const msg =
          (e?.code ? `${e.code} ` : "") + (e?.message || "Unknown error");
        console.error("[blog] load error:", e);
        setErrorMsg(msg.trim());
        setNotFound(true);
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [slug]);

  // Newer/older
  const { newerPost, olderPost } = useMemo(() => {
    if (!slug || !list.length)
      return {
        newerPost: null as SlugRow | null,
        olderPost: null as SlugRow | null,
      };
    const idx = list.findIndex((p) => p.slug === slug);
    if (idx === -1) return { newerPost: null, olderPost: null };
    return {
      newerPost: idx - 1 >= 0 ? list[idx - 1] : null,
      olderPost: idx + 1 < list.length ? list[idx + 1] : null,
    };
  }, [slug, list]);

  // SEO values
  const siteName = "OLLIN";
  const siteUrl = String(import.meta.env.VITE_SITE_URL || "").replace(
    /\/$/,
    "",
  );

  const canonicalPath = useMemo(() => {
    const path = post?.slug ? `/blog/${post.slug}` : "/blog";
    return siteUrl ? `${siteUrl}${path}` : path;
  }, [post?.slug, siteUrl]);

  const seoTitle = (
    post?.seo_title?.trim() ||
    post?.title?.trim() ||
    "Blog"
  ).trim();
  const seoDescription =
    post?.seo_description?.trim() ||
    "Insights, playbooks, and updates from OLLIN on building calm systems that grow service businesses.";

  const readMins = estimateReadingMinutes(post?.content_md ?? null);

  const jsonLdPost = useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.seo_title?.trim() || post.title,
      description: post.seo_description?.trim() || undefined,
      datePublished: post.published_at || undefined,
      dateModified: post.updated_at || undefined,
      mainEntityOfPage: canonicalPath,
      image: post.cover_image_url ? [post.cover_image_url] : undefined,
      keywords: post.tags?.length ? post.tags.join(", ") : undefined,
      publisher: { "@type": "Organization", name: siteName },
    };
  }, [post, canonicalPath]);

  // Apply SEO to head (no libs)
  useEffect(() => {
    // Title + description + canonical even while loading
    document.title = `${seoTitle} — ${siteName}`;
    upsertMetaDescription(seoDescription);
    upsertCanonical(canonicalPath);

    // OpenGraph + Twitter basics
    upsertMetaProperty("og:site_name", siteName);
    upsertMetaProperty("og:type", "article");
    upsertMetaProperty("og:title", seoTitle);
    upsertMetaProperty("og:description", seoDescription);
    upsertMetaProperty("og:url", canonicalPath);

    const hasImg = !!post?.cover_image_url;
    if (hasImg) {
      upsertMetaProperty("og:image", post!.cover_image_url!);
    } else {
      // remove if previously set by another page
      removeHeadNode('meta[property="og:image"]');
    }

    upsertMetaName("twitter:card", hasImg ? "summary_large_image" : "summary");
    upsertMetaName("twitter:title", seoTitle);
    upsertMetaName("twitter:description", seoDescription);

    if (hasImg) {
      upsertMetaName("twitter:image", post!.cover_image_url!);
    } else {
      removeHeadNode('meta[name="twitter:image"]');
    }

    // JSON-LD
    if (jsonLdPost) {
      upsertJsonLd("jsonld-blogpost", jsonLdPost);
    } else {
      const el = document.getElementById("jsonld-blogpost");
      if (el) el.remove();
    }

    return () => {
      // optional cleanup on unmount
      const el = document.getElementById("jsonld-blogpost");
      if (el) el.remove();
    };
  }, [
    seoTitle,
    seoDescription,
    canonicalPath,
    siteName,
    post?.cover_image_url,
    jsonLdPost,
  ]);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto pt-10">
        <div className="h-4 w-32 bg-black/10 mb-6" />
        <div className="h-10 w-3/4 bg-black/10 mb-4" />
        <div className="h-5 w-2/3 bg-black/5 mb-10" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-black/5" />
          <div className="h-4 w-full bg-black/5" />
          <div className="h-4 w-5/6 bg-black/5" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-[900px] mx-auto">
        {errorMsg ? (
          <div className="mb-6 border border-black/10 bg-white/40 p-6 text-sm text-black/70">
            <div className="font-semibold text-black">Blog error</div>
            <div className="mt-1">{errorMsg}</div>
          </div>
        ) : null}

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black"
        >
          <span aria-hidden>←</span> Back to blog
        </Link>

        <h2 className="text-2xl md:text-3xl font-semibold mt-8 text-ollin-black">
          Post not found
        </h2>
        <p className="text-ollin-black/70 mt-2">
          The post may have been moved, unpublished, or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="pt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black"
        >
          <span aria-hidden>←</span> Back to blog
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ollin-black/55">
        {post.published_at && <span>{formatDate(post.published_at)}</span>}
        <span className="opacity-40">•</span>
        <span>{readMins} min read</span>

        {!!post.tags?.length && (
          <>
            <span className="opacity-40">•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center border border-black/10 bg-white/40 px-2.5 py-1 text-[11px] text-black/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-ollin-black">
        {post.title}
      </h1>

      {post.cover_image_url && (
        <div className="mt-10 overflow-hidden border border-black/10 bg-white/40">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      <article
        className="
          mt-10 pb-10
          prose prose-lg max-w-none
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-headings:text-ollin-black
          prose-h2:mt-10 prose-h2:mb-3
          prose-h3:mt-8  prose-h3:mb-2
          prose-p:leading-relaxed prose-p:my-4
          prose-blockquote:border-l prose-blockquote:border-black/10 prose-blockquote:pl-4 prose-blockquote:text-black/70
          prose-a:text-ollin-black
          prose-a:underline
          prose-a:decoration-black/20
          hover:prose-a:decoration-black/40
          prose-strong:text-ollin-black
          prose-ul:pl-6 prose-ul:my-4 prose-ul:list-disc
          prose-ol:pl-6 prose-ol:my-4 prose-ol:list-decimal
          prose-li:my-1
          prose-pre:bg-black/5
          prose-pre:border prose-pre:border-black/10
          prose-pre:rounded-none
          prose-pre:p-4
          prose-code:bg-black/5
          prose-code:px-1
          prose-code:py-0.5
          prose-code:rounded-none
        "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-6 my-4" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-6 my-4" />
            ),
            li: ({ node, ...props }) => <li {...props} className="my-1" />,
            p: ({ node, ...props }) => (
              <p {...props} className="my-4 leading-relaxed" />
            ),
          }}
        >
          {post.content_md ?? ""}
        </ReactMarkdown>
      </article>

      <div className="mt-10 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {newerPost ? (
          <Link
            to={`/blog/${newerPost.slug}`}
            className="
              group border border-black/10 bg-white/35 px-6 py-5
              hover:bg-white/55 transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20
            "
            rel="prev"
            aria-label="Newer post"
          >
            <div className="text-[11px] text-black/55 mb-2 inline-flex items-center gap-2">
              <span
                className="transition-transform duration-200 group-hover:-translate-x-1"
                aria-hidden
              >
                ←
              </span>
              <span>Newer</span>
            </div>
            <div className="text-base font-semibold text-ollin-black group-hover:underline decoration-black/20">
              {newerPost.title}
            </div>
            {newerPost.published_at && (
              <div className="mt-2 text-xs text-black/55">
                {formatDate(newerPost.published_at)}
              </div>
            )}
          </Link>
        ) : (
          <div className="border border-black/10 bg-white/15 px-6 py-5">
            <div className="text-[11px] text-black/55 inline-flex items-center gap-2">
              <span className="opacity-70" aria-hidden>
                ←
              </span>
              <span>No newer post</span>
            </div>
          </div>
        )}

        {olderPost ? (
          <Link
            to={`/blog/${olderPost.slug}`}
            className="
              group border border-black/10 bg-white/35 px-6 py-5
              hover:bg-white/55 transition md:text-right
              focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20
            "
            rel="next"
            aria-label="Older post"
          >
            <div className="text-[11px] text-black/55 mb-2 inline-flex items-center gap-2 md:justify-end w-full">
              <span>Older</span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </div>
            <div className="text-base font-semibold text-ollin-black group-hover:underline decoration-black/20">
              {olderPost.title}
            </div>
            {olderPost.published_at && (
              <div className="mt-2 text-xs text-black/55">
                {formatDate(olderPost.published_at)}
              </div>
            )}
          </Link>
        ) : (
          <div className="border border-black/10 bg-white/15 px-6 py-5 md:text-right">
            <div className="text-[11px] text-black/55 inline-flex items-center gap-2 md:justify-end w-full">
              <span>No older post</span>
              <span className="opacity-70" aria-hidden>
                →
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
