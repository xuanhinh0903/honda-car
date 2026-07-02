import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  getDealership,
  getDelivery,
  getNavigation,
  getPricing,
  getProcess,
  getPromotions,
  saveDealership,
  saveDelivery,
  saveNavigation,
  savePricing,
  saveProcess,
  savePromotions,
  type AdminDataKey,
} from "@/lib/data-server";
import { revalidateSite } from "@/lib/revalidate";
import type {
  DealershipInfo,
  DeliveryImage,
  NavItem,
  PricingCar,
  ProcessStep,
  Promotion,
} from "@/lib/types";

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") as AdminDataKey | null;

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  switch (key) {
    case "dealership":
      return NextResponse.json(getDealership());
    case "navigation":
      return NextResponse.json(getNavigation());
    case "pricing":
      return NextResponse.json(getPricing());
    case "delivery":
      return NextResponse.json(getDelivery());
    case "process":
      return NextResponse.json(getProcess());
    case "promotions":
      return NextResponse.json(getPromotions());
    default:
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as {
    key?: AdminDataKey;
    data?: unknown;
  };

  if (!body.key || body.data === undefined) {
    return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
  }

  switch (body.key) {
    case "dealership":
      saveDealership(body.data as DealershipInfo);
      break;
    case "navigation":
      saveNavigation(body.data as NavItem[]);
      break;
    case "pricing":
      savePricing(
        body.data as {
          title: string;
          updatedAt: string;
          cars: PricingCar[];
        }
      );
      break;
    case "delivery":
      saveDelivery(
        body.data as {
          title: string;
          description: string;
          images: DeliveryImage[];
        }
      );
      break;
    case "process":
      saveProcess(
        body.data as { title: string; steps: ProcessStep[] }
      );
      break;
    case "promotions":
      savePromotions(body.data as Promotion[]);
      break;
    default:
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true });
}
