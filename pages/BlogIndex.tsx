import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Tag } from "lucide-react";
import { useHead } from "@unhead/react";
import { supabase } from "@/lib/supabase";

type BlogPostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  seo_description: string | null;
};

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

function clampText(text: string, max = 140) {
  const t = (text || "").trim();
  return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | "all">("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,content_md,cover_image_url,tags,published_at,seo_description")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) console.error("[blog] BlogIndex fetch error:", error);

      setPosts((data ?? []) as BlogPostRow[]);
      setLoading(false);
    })();
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => (p.tags ?? []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      const matchesTag = activeTag === "all" || (p.tags ?? []).includes(activeTag);
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  const siteName = "OLLIN";
  const baseUrl = String((import.meta as any).env?.VITE_SITE_URL || "").replace(/\/$/, "");

  const pageTitle = `Blog — ${siteName}`;
  const pageDescription =
    "Insights, playbooks, and updates on systems that help service businesses grow calmly — and scale deliberately.";

  const canonical = baseUrl ? `${baseUrl}/blog` : "/blog";

  const jsonLd = useMemo(() => {
    const itemList = filtered.slice(0, 50).map((p, i) => {
      const url = baseUrl ? `${baseUrl}/blog/${p.slug}` : `/blog/${p.slug}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        url,
        name: p.title,
      };
    });

    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${siteName} Blog`,
      description: pageDescription,
      url: canonical,
      blogPost: itemList.map((x) => ({
        "@type": "BlogPosting",
        headline: x.name,
        url: x.url,
      })),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    };
  }, [filtered, baseUrl, canonical]);

  useHead({
    title: pageTitle,
    meta: [
      { name: "description", content: pageDescription },
      { property: "og:site_name", content: siteName },
      { property: "og:type", content: "website" },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: pageDescription },
    ],
    link: [{ rel: "canonical", href: canonical }],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(jsonLd),
      } as any,
    ],
  });

  return (
    <div className="space-y-10">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="
              w-full pl-10 pr-4 py-3
              border border-black/10
              bg-white/60
              text-sm
              focus:outline-none focus:ring-0
            "
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTag("all")}
            className={`
              inline-flex items-center gap-2 px-3 py-1 text-xs border border-black/10
              ${activeTag === "all" ? "bg-black text-white" : "bg-white/50 text-black/70 hover:text-black"}
            `}
          >
            All
          </button>

          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`
                inline-flex items-center gap-2 px-3 py-1 text-xs border border-black/10
                ${activeTag === t ? "bg-black text-white" : "bg-white/50 text-black/70 hover:text-black"}
              `}
            >
              <Tag className="w-3 h-3" />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-sm text-ollin-gray">Loading…</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {filtered.map((p) => {
            const readMins = estimateReadingMinutes(p.content_md ?? null);

            return (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="
                  group
                  border border-black/10
                  bg-white/40
                  hover:bg-white/55
                  transition
                  overflow-hidden
                  focus:outline-none
                "
              >
                {/* Optional cover (kept low) */}
                {p.cover_image_url ? (
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={p.cover_image_url}
                      className="h-full w-full object-cover opacity-95 group-hover:opacity-100 transition"
                      loading="lazy"
                      alt={p.title}
                    />
                    {/* Calm overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
                  </div>
                ) : (
                  <div className="h-3 bg-black/5" />
                )}

                {/* Content block (square, shorter, better centered) */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-black/55">
                    <span>{formatDate(p.published_at)}</span>
                    <span className="opacity-40">•</span>
                    <span>{readMins} min read</span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold leading-snug text-ollin-black">
                    {p.title}
                  </h3>

                  {p.excerpt ? (
                    <p className="mt-2 text-sm text-black/65 leading-relaxed">
                      {clampText(p.excerpt)}
                    </p>
                  ) : null}

                  {/* Tags */}
                  {!!p.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center border border-black/10 bg-white/40 px-2.5 py-1 text-[11px] text-black/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-xs font-medium text-black/70 group-hover:text-black transition">
                    Read →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
