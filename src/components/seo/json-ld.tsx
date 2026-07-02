import { getDealership } from "@/lib/data-server";

const dealership = getDealership();

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: dealership.name,
    description: dealership.tagline,
    url: "https://hondatiendat.vn",
    telephone: dealership.hotline,
    email: dealership.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: dealership.address,
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: [
      dealership.social.facebook,
      dealership.social.facebookPage,
      ...(dealership.social.youtube ? [dealership.social.youtube] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
