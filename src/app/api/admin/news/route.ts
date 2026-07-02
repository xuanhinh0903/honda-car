import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  deleteNewsArticle,
  getNews,
  getNewsBySlug,
  saveNewsArticle,
  saveNewsIndex,
} from "@/lib/data-server";
import { revalidateNews, revalidateSite } from "@/lib/revalidate";
import type { NewsArticle, NewsIndexItem } from "@/lib/types";

function toIndexItem(article: NewsArticle): NewsIndexItem {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    date: article.date,
    category: article.category,
    featured: article.featured,
  };
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const article = getNewsBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  return NextResponse.json({
    index: getNews(),
    items: getNews().map((item) => getNewsBySlug(item.slug)).filter(Boolean),
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const article = (await request.json()) as NewsArticle;
  if (!article.slug || !article.title) {
    return NextResponse.json({ error: "Missing article data" }, { status: 400 });
  }

  const articles = getNews();
  if (articles.some((item) => item.slug === article.slug)) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
  }

  saveNewsArticle(article.slug, article);
  saveNewsIndex([...articles, toIndexItem(article)]);
  revalidateNews(article.slug);

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as {
    article?: NewsArticle;
    oldSlug?: string;
  };

  if (!body.article?.slug) {
    return NextResponse.json({ error: "Missing article data" }, { status: 400 });
  }

  const oldSlug = body.oldSlug ?? body.article.slug;
  const articles = getNews().filter((item) => item.slug !== oldSlug);

  if (oldSlug !== body.article.slug) {
    deleteNewsArticle(oldSlug);
  }

  saveNewsArticle(body.article.slug, body.article);
  saveNewsIndex([...articles, toIndexItem(body.article)]);
  revalidateNews(body.article.slug);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  deleteNewsArticle(slug);
  revalidateSite();

  return NextResponse.json({ ok: true });
}
