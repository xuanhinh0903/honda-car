"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CarImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function CarImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
}: CarImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-charcoal-light to-charcoal flex items-center justify-center",
          fill && "absolute inset-0",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-silver text-sm font-medium">{alt}</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 450}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
