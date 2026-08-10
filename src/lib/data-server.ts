import "server-only";

import type {
  Car,
  CarIndexItem,
  DealershipInfo,
  DeliveryImage,
  NavItem,
  NewsArticle,
  NewsIndexItem,
  PageContent,
  PricingCar,
  ProcessStep,
  Promotion,
} from "./types";
import {
  deleteDataFile,
  listDataJsonFiles,
  readDataJson,
  writeDataJson,
} from "./fs-data";

export async function getDealership(): Promise<DealershipInfo> {
  return readDataJson<DealershipInfo>("dealership.json");
}

export async function getNavigation(): Promise<NavItem[]> {
  return (await readDataJson<{ items: NavItem[] }>("navigation.json")).items;
}

export async function getCars(): Promise<CarIndexItem[]> {
  return (await readDataJson<{ cars: CarIndexItem[] }>("cars", "index.json"))
    .cars;
}

export async function getFeaturedCars(): Promise<CarIndexItem[]> {
  return (await getCars()).filter((car) => car.featured);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  try {
    return await readDataJson<Car>("cars", `${slug}.json`);
  } catch {
    return null;
  }
}

export async function getCarThumbnail(slug: string): Promise<string> {
  return (
    (await getCarBySlug(slug))?.thumbnail ??
    `/images/cars/${slug.replace(/-/g, "")}-thumb.jpg`
  );
}

export async function getAllCarSlugs(): Promise<string[]> {
  return listDataJsonFiles("cars");
}

export async function getNews(): Promise<NewsIndexItem[]> {
  return (await readDataJson<{ articles: NewsIndexItem[] }>("news", "index.json"))
    .articles;
}

export async function getFeaturedNews(limit = 4): Promise<NewsIndexItem[]> {
  return (await getNews())
    .filter((article) => article.featured)
    .slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    return await readDataJson<NewsArticle>("news", `${slug}.json`);
  } catch {
    return null;
  }
}

export async function getAllNewsSlugs(): Promise<string[]> {
  return listDataJsonFiles("news");
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return (await readDataJson<{ steps: ProcessStep[] }>("process.json")).steps;
}

export async function getPricing(): Promise<{
  title: string;
  updatedAt: string;
  cars: PricingCar[];
}> {
  return readDataJson("pricing.json");
}

export async function getDeliveryImages(): Promise<DeliveryImage[]> {
  return (await readDataJson<{ images: DeliveryImage[] }>("delivery.json"))
    .images;
}

export async function getDelivery() {
  return readDataJson<{
    title: string;
    description: string;
    images: DeliveryImage[];
  }>("delivery.json");
}

export async function getProcess() {
  return readDataJson<{ title: string; steps: ProcessStep[] }>("process.json");
}

export async function getPromotions(): Promise<Promotion[]> {
  return (await readDataJson<{ items: Promotion[] }>("promotions.json")).items;
}

export async function saveDealership(data: DealershipInfo) {
  await writeDataJson(data, "dealership.json");
}

export async function saveCarsIndex(cars: CarIndexItem[]) {
  await writeDataJson({ cars }, "cars", "index.json");
}

export async function saveCar(slug: string, car: Car) {
  await writeDataJson(car, "cars", `${slug}.json`);
}

export async function deleteCar(slug: string) {
  await deleteDataFile("cars", `${slug}.json`);
  await saveCarsIndex((await getCars()).filter((car) => car.slug !== slug));
}

export async function saveNewsIndex(articles: NewsIndexItem[]) {
  await writeDataJson({ articles }, "news", "index.json");
}

export async function saveNewsArticle(slug: string, article: NewsArticle) {
  await writeDataJson(article, "news", `${slug}.json`);
}

export async function deleteNewsArticle(slug: string) {
  await deleteDataFile("news", `${slug}.json`);
  await saveNewsIndex(
    (await getNews()).filter((article) => article.slug !== slug)
  );
}

export async function savePricing(data: {
  title: string;
  updatedAt: string;
  cars: PricingCar[];
}) {
  await writeDataJson(data, "pricing.json");
}

export async function saveDelivery(data: {
  title: string;
  description: string;
  images: DeliveryImage[];
}) {
  await writeDataJson(data, "delivery.json");
}

export async function saveProcess(data: {
  title: string;
  steps: ProcessStep[];
}) {
  await writeDataJson(data, "process.json");
}

export async function savePromotions(items: Promotion[]) {
  await writeDataJson({ items }, "promotions.json");
}

export async function saveNavigation(items: NavItem[]) {
  await writeDataJson({ items }, "navigation.json");
}

export async function getPageContent(): Promise<PageContent> {
  return readDataJson<PageContent>("pages.json");
}

export async function savePageContent(content: PageContent) {
  await writeDataJson(content, "pages.json");
}

export const ADMIN_DATA_KEYS = [
  "dealership",
  "navigation",
  "cars",
  "news",
  "pricing",
  "delivery",
  "process",
  "promotions",
  "pages",
] as const;

export type AdminDataKey = (typeof ADMIN_DATA_KEYS)[number];
