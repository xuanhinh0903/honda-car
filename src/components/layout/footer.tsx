import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { getDealership, getCars, getNews } from "@/lib/data";
import { formatPhone } from "@/lib/format";
import { QuoteForm } from "@/components/forms/quote-form";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./logo";

const dealership = getDealership();
const cars = getCars();
const news = getNews().slice(0, 5);

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <Logo imageClassName="h-12" />
            </div>
            <p className="text-silver text-sm leading-relaxed mb-4">
              {dealership.tagline}
            </p>
            <div className="space-y-2 text-sm text-silver">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-honda-red" />
                {dealership.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-honda-red" />
                <a
                  href={`tel:${dealership.hotline}`}
                  className="hover:text-white transition-colors"
                >
                  {formatPhone(dealership.hotline)}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-honda-red" />
                {dealership.email}
              </p>
              <p className="flex flex-wrap gap-3 pt-2">
                <a
                  href={dealership.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={dealership.social.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Fanpage
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              {cars.map((car) => (
                <li key={car.slug}>
                  <Link
                    href={`/san-pham/${car.slug}`}
                    className="text-silver text-sm hover:text-white transition-colors"
                  >
                    {car.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Tin tức</h3>
            <ul className="space-y-2">
              {news.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/tin-tuc/${article.slug}`}
                    className="text-silver text-sm hover:text-white transition-colors line-clamp-2"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Yêu cầu báo giá</h3>
            <p className="text-silver text-sm mb-4">
              Điền thông tin để nhận báo giá xe Honda!
            </p>
            <QuoteForm compact />
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-silver">
          <p>
            {dealership.directorTitle} – {dealership.director} –{" "}
            {formatPhone(dealership.hotline)}
          </p>
          <p>Copyright © {new Date().getFullYear()} {dealership.name}</p>
        </div>
      </div>
    </footer>
  );
}
