import type {
  Car,
  CarIndexItem,
  DealershipInfo,
  DeliveryImage,
  NavItem,
  NewsArticle,
  NewsIndexItem,
  PricingCar,
  ProcessStep,
  Promotion,
} from "./types";

import dealershipData from "../../data/dealership.json";
import navigationData from "../../data/navigation.json";
import processData from "../../data/process.json";
import promotionsData from "../../data/promotions.json";
import carsIndexData from "../../data/cars/index.json";
import pricingData from "../../data/pricing.json";
import deliveryData from "../../data/delivery.json";
import newsIndexData from "../../data/news/index.json";

import cityData from "../../data/cars/city.json";
import civicData from "../../data/cars/civic.json";
import crvData from "../../data/cars/cr-v.json";
import hrvData from "../../data/cars/hr-v.json";
import brvData from "../../data/cars/br-v.json";
import brioData from "../../data/cars/brio.json";

import newsCity2026 from "../../data/news/bang-gia-honda-city-2026.json";
import newsCityCompare from "../../data/news/so-sanh-honda-city-2026.json";
import newsCivicPrice from "../../data/news/gia-lan-banh-honda-civic-2026.json";
import newsHrvPrice from "../../data/news/gia-lan-banh-honda-hrv-2026.json";
import newsCrvReview from "../../data/news/honda-crv-2026-danh-gia.json";

const carMap: Record<string, Car> = {
  city: cityData as Car,
  civic: civicData as Car,
  "cr-v": crvData as Car,
  "hr-v": hrvData as Car,
  "br-v": brvData as Car,
  brio: brioData as Car,
};

const newsMap: Record<string, NewsArticle> = {
  "bang-gia-honda-city-2026": newsCity2026 as NewsArticle,
  "so-sanh-honda-city-2026": newsCityCompare as NewsArticle,
  "gia-lan-banh-honda-civic-2026": newsCivicPrice as NewsArticle,
  "gia-lan-banh-honda-hrv-2026": newsHrvPrice as NewsArticle,
  "honda-crv-2026-danh-gia": newsCrvReview as NewsArticle,
};

export function getDealership(): DealershipInfo {
  return dealershipData as DealershipInfo;
}

export function getNavigation(): NavItem[] {
  return navigationData.items as NavItem[];
}

export function getCars(): CarIndexItem[] {
  return carsIndexData.cars as CarIndexItem[];
}

export function getFeaturedCars(): CarIndexItem[] {
  return getCars().filter((car) => car.featured);
}

export function getCarThumbnail(slug: string): string {
  return (
    getCarBySlug(slug)?.thumbnail ??
    `/images/cars/${slug.replace(/-/g, "")}-thumb.jpg`
  );
}

export function getCarBySlug(slug: string): Car | null {
  return carMap[slug] ?? null;
}

export function getAllCarSlugs(): string[] {
  return Object.keys(carMap);
}

export function getNews(): NewsIndexItem[] {
  return newsIndexData.articles as NewsIndexItem[];
}

export function getFeaturedNews(limit = 4): NewsIndexItem[] {
  return getNews()
    .filter((article) => article.featured)
    .slice(0, limit);
}

export function getNewsBySlug(slug: string): NewsArticle | null {
  return newsMap[slug] ?? null;
}

export function getAllNewsSlugs(): string[] {
  return Object.keys(newsMap);
}

export function getProcessSteps(): ProcessStep[] {
  return processData.steps as ProcessStep[];
}

export function getPricing(): { title: string; updatedAt: string; cars: PricingCar[] } {
  return pricingData as { title: string; updatedAt: string; cars: PricingCar[] };
}

export function getDeliveryImages(): DeliveryImage[] {
  return deliveryData.images as DeliveryImage[];
}

export function getPromotions(): Promotion[] {
  return promotionsData.items as Promotion[];
}

export const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";
