export interface DealershipInfo {
  name: string;
  tagline: string;
  address: string;
  hotline: string;
  hotlineDisplay: string;
  director: string;
  directorTitle: string;
  email: string;
  social: {
    facebook: string;
    facebookPage: string;
    zalo: string;
    youtube: string;
  };
  stats: {
    area: string;
    floors: number;
    staff: number;
  };
  intro: string;
  introExtended: string;
  slogan: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface CarIndexItem {
  slug: string;
  name: string;
  priceFrom: number;
  category: string;
  featured: boolean;
}

export interface CarVariant {
  name: string;
  price: number;
  engine: string;
  transmission: string;
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelConsumption: string;
  seats: number;
  length: string;
  width: string;
  height: string;
}

export interface Car {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  priceFrom: number;
  heroImage: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  highlights: string[];
  variants: CarVariant[];
  specs: CarSpecs;
}

export interface NewsIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured: boolean;
}

export interface NewsArticle extends NewsIndexItem {
  author: string;
  content: string[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface PricingCar {
  slug: string;
  name: string;
  variants: { name: string; price: number }[];
}

export interface DeliveryImage {
  src: string;
  caption: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  validUntil: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface SectionHeading {
  subtitle?: string;
  title?: string;
}

export interface HomeHeroContent {
  image: string;
  description: string;
  hotlineLabel: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  tertiaryCta: CtaLink;
}

export interface HomeContent {
  hero: HomeHeroContent;
  dealerIntro: SectionHeading;
  showcase: SectionHeading;
  process: SectionHeading;
  video: SectionHeading & { youtubeId: string };
  newsPreview: SectionHeading;
  cta: {
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
}

export interface AboutFeature {
  title: string;
  description: string;
}

export interface AboutContent {
  subtitle: string;
  title: string;
  features: AboutFeature[];
}

export interface ProductsContent {
  subtitle: string;
  title: string;
  description: string;
}

export interface DeliveryContent {
  subtitle: string;
  title: string;
  description: string;
}

export interface NewsPageContent {
  subtitle: string;
  title: string;
}

export interface ContactContent {
  subtitle: string;
  title: string;
  workingHours: string;
  mapEmbedUrl: string;
}

export interface SubpageContent {
  subtitle: string;
  title: string;
  description: string;
}

export interface PageContent {
  home: HomeContent;
  about: AboutContent;
  products: ProductsContent;
  delivery: DeliveryContent;
  news: NewsPageContent;
  contact: ContactContent;
  testDrive: SubpageContent;
  rollingCost: SubpageContent;
}
