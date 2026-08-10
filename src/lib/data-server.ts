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

export function getDealership(): DealershipInfo {
  return readDataJson<DealershipInfo>("dealership.json");
}

export function getNavigation(): NavItem[] {
  return readDataJson<{ items: NavItem[] }>("navigation.json").items;
}

export function getCars(): CarIndexItem[] {
  return readDataJson<{ cars: CarIndexItem[] }>("cars", "index.json").cars;
}

export function getFeaturedCars(): CarIndexItem[] {
  return getCars().filter((car) => car.featured);
}

export function getCarBySlug(slug: string): Car | null {
  try {
    return readDataJson<Car>("cars", `${slug}.json`);
  } catch {
    return null;
  }
}

export function getCarThumbnail(slug: string): string {
  return (
    getCarBySlug(slug)?.thumbnail ??
    `/images/cars/${slug.replace(/-/g, "")}-thumb.jpg`
  );
}

export function getAllCarSlugs(): string[] {
  return listDataJsonFiles("cars");
}

export function getNews(): NewsIndexItem[] {
  return readDataJson<{ articles: NewsIndexItem[] }>("news", "index.json")
    .articles;
}

export function getFeaturedNews(limit = 4): NewsIndexItem[] {
  return getNews()
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsArticle | null {
  try {
    return readDataJson<NewsArticle>("news", `${slug}.json`);
  } catch {
    return null;
  }
}

export function getAllNewsSlugs(): string[] {
  return listDataJsonFiles("news");
}

export function getProcessSteps(): ProcessStep[] {
  return readDataJson<{ steps: ProcessStep[] }>("process.json").steps;
}

export function getPricing(): {
  title: string;
  updatedAt: string;
  cars: PricingCar[];
} {
  return readDataJson("pricing.json");
}

export function getDeliveryImages(): DeliveryImage[] {
  return readDataJson<{ images: DeliveryImage[] }>("delivery.json").images;
}

export function getDelivery() {
  return readDataJson<{
    title: string;
    description: string;
    images: DeliveryImage[];
  }>("delivery.json");
}

export function getProcess() {
  return readDataJson<{ title: string; steps: ProcessStep[] }>("process.json");
}

export function getPromotions(): Promotion[] {
  return readDataJson<{ items: Promotion[] }>("promotions.json").items;
}

export function saveDealership(data: DealershipInfo) {
  writeDataJson(data, "dealership.json");
}

export function saveCarsIndex(cars: CarIndexItem[]) {
  writeDataJson({ cars }, "cars", "index.json");
}

export function saveCar(slug: string, car: Car) {
  writeDataJson(car, "cars", `${slug}.json`);
}

export function deleteCar(slug: string) {
  deleteDataFile("cars", `${slug}.json`);
  saveCarsIndex(getCars().filter((car) => car.slug !== slug));
}

export function saveNewsIndex(articles: NewsIndexItem[]) {
  writeDataJson({ articles }, "news", "index.json");
}

export function saveNewsArticle(slug: string, article: NewsArticle) {
  writeDataJson(article, "news", `${slug}.json`);
}

export function deleteNewsArticle(slug: string) {
  deleteDataFile("news", `${slug}.json`);
  saveNewsIndex(getNews().filter((article) => article.slug !== slug));
}

export function savePricing(data: {
  title: string;
  updatedAt: string;
  cars: PricingCar[];
}) {
  writeDataJson(data, "pricing.json");
}

export function saveDelivery(data: {
  title: string;
  description: string;
  images: DeliveryImage[];
}) {
  writeDataJson(data, "delivery.json");
}

export function saveProcess(data: { title: string; steps: ProcessStep[] }) {
  writeDataJson(data, "process.json");
}

export function savePromotions(items: Promotion[]) {
  writeDataJson({ items }, "promotions.json");
}

export function saveNavigation(items: NavItem[]) {
  writeDataJson({ items }, "navigation.json");
}

export function getPageContent(): PageContent {
  return readDataJson<PageContent>("pages.json");
}

export function savePageContent(content: PageContent) {
  writeDataJson(content, "pages.json");
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
