import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";

export function VideoSection() {
  return (
    <section className="py-20 bg-pearl">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle="Video" title="Khám phá Honda Tiến Đạt" />

        <FadeIn>
          <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/9vQnKO_2kK4"
              title="Honda Tiến Đạt"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
