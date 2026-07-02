import { formatVND } from "@/lib/format";
import type { PricingCar } from "@/lib/types";

interface PriceTableProps {
  cars: PricingCar[];
}

export function PriceTable({ cars }: PriceTableProps) {
  return (
    <div className="space-y-8">
      {cars.map((car) => (
        <div
          key={car.slug}
          className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm"
        >
          <div className="bg-charcoal px-6 py-4">
            <h3 className="text-white font-bold text-lg">{car.name}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">
                    Phiên bản
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-muted-foreground">
                    Giá niêm yết
                  </th>
                </tr>
              </thead>
              <tbody>
                {car.variants.map((variant, index) => (
                  <tr
                    key={variant.name}
                    className={
                      index < car.variants.length - 1
                        ? "border-b border-border/30"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 font-medium">{variant.name}</td>
                    <td className="px-6 py-4 text-right font-bold text-honda-red">
                      {formatVND(variant.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
