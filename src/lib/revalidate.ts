import { revalidatePath } from "next/cache";

export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/gioi-thieu");
  revalidatePath("/san-pham");
  revalidatePath("/bang-gia");
  revalidatePath("/ban-giao-xe");
  revalidatePath("/tin-tuc");
  revalidatePath("/lien-he");
  revalidatePath("/dang-ky-lai-thu");
  revalidatePath("/tinh-phi-lan-banh");
}

export function revalidateCar(slug: string) {
  revalidateSite();
  revalidatePath(`/san-pham/${slug}`);
}

export function revalidateNews(slug: string) {
  revalidateSite();
  revalidatePath(`/tin-tuc/${slug}`);
}
