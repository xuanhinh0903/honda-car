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
    const article = await getNewsBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  const news = await getNews();
  const items = await Promise.all(
    news.map(async (item) => getNewsBySlug(item.slug))
  );

  return NextResponse.json({
    index: news,
    items: items.filter(Boolean),
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const article = (await request.json()) as NewsArticle;
  if (!article.slug || !article.title) {
    return NextResponse.json({ error: "Missing article data" }, { status: 400 });
  }

  const articles = await getNews();
  if (articles.some((item) => item.slug === article.slug)) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
  }

  await saveNewsArticle(article.slug, article);
  await saveNewsIndex([...articles, toIndexItem(article)]);
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
  const articles = (await getNews()).filter((item) => item.slug !== oldSlug);

  if (oldSlug !== body.article.slug) {
    await deleteNewsArticle(oldSlug);
  }

  await saveNewsArticle(body.article.slug, body.article);
  await saveNewsIndex([...articles, toIndexItem(body.article)]);
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

  await deleteNewsArticle(slug);
  revalidateSite();

  return NextResponse.json({ ok: true });
}
