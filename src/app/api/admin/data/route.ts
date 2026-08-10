import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  getDealership,
  getDelivery,
  getNavigation,
  getPageContent,
  getPricing,
  getProcess,
  getPromotions,
  saveDealership,
  saveDelivery,
  saveNavigation,
  savePageContent,
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
  PageContent,
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
      return NextResponse.json(await getDealership());
    case "navigation":
      return NextResponse.json(await getNavigation());
    case "pricing":
      return NextResponse.json(await getPricing());
    case "delivery":
      return NextResponse.json(await getDelivery());
    case "process":
      return NextResponse.json(await getProcess());
    case "promotions":
      return NextResponse.json(await getPromotions());
    case "pages":
      return NextResponse.json(await getPageContent());
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
      await saveDealership(body.data as DealershipInfo);
      break;
    case "navigation":
      await saveNavigation(body.data as NavItem[]);
      break;
    case "pricing":
      await savePricing(
        body.data as {
          title: string;
          updatedAt: string;
          cars: PricingCar[];
        }
      );
      break;
    case "delivery":
      await saveDelivery(
        body.data as {
          title: string;
          description: string;
          images: DeliveryImage[];
        }
      );
      break;
    case "process":
      await saveProcess(
        body.data as { title: string; steps: ProcessStep[] }
      );
      break;
    case "promotions":
      await savePromotions(body.data as Promotion[]);
      break;
    case "pages":
      await savePageContent(body.data as PageContent);
      break;
    default:
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  revalidateSite();
  return NextResponse.json({ ok: true });
}
