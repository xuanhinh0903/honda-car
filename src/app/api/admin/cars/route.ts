import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  deleteCar,
  getCarBySlug,
  getCars,
  saveCar,
  saveCarsIndex,
} from "@/lib/data-server";
import { revalidateCar, revalidateSite } from "@/lib/revalidate";
import type { Car, CarIndexItem } from "@/lib/types";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const car = getCarBySlug(slug);
    if (!car) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(car);
  }

  return NextResponse.json({
    index: getCars(),
    items: getCars().map((item) => ({
      ...item,
      detail: getCarBySlug(item.slug),
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as {
    car?: Car;
    indexItem?: CarIndexItem;
  };

  if (!body.car?.slug || !body.indexItem) {
    return NextResponse.json({ error: "Missing car data" }, { status: 400 });
  }

  const cars = getCars();
  if (cars.some((item) => item.slug === body.car!.slug)) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
  }

  saveCar(body.car.slug, body.car);
  saveCarsIndex([...cars, body.indexItem]);
  revalidateCar(body.car.slug);

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as {
    car?: Car;
    indexItem?: CarIndexItem;
    oldSlug?: string;
  };

  if (!body.car?.slug || !body.indexItem) {
    return NextResponse.json({ error: "Missing car data" }, { status: 400 });
  }

  const oldSlug = body.oldSlug ?? body.car.slug;
  const cars = getCars().filter((item) => item.slug !== oldSlug);

  if (oldSlug !== body.car.slug) {
    deleteCar(oldSlug);
  }

  saveCar(body.car.slug, body.car);
  saveCarsIndex([...cars, body.indexItem]);
  revalidateCar(body.car.slug);

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

  deleteCar(slug);
  revalidateSite();

  return NextResponse.json({ ok: true });
}
