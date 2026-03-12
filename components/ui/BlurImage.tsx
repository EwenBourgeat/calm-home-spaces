"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface BlurImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackColor?: string;
  wrapperClassName?: string;
}

/**
 * A wrapper around next/image that provides a smooth "blur-up" and "scale-down"
 * reveal effect once the image is completely loaded.
 * It prevents harsh layout shifts or glitchy loading by maintaining a
 * solid placeholder color defined by `fallbackColor` until ready.
 */
export function BlurImage({
  src,
  alt,
  className,
  fallbackColor = "bg-stone-200/50",
  wrapperClassName,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full",
        fallbackColor,
        isLoading && "animate-pulse",
        wrapperClassName
      )}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={cn(
          "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isLoading ? "scale-105 blur-md opacity-0" : "scale-100 blur-0 opacity-100",
          className
        )}
      />
    </div>
  );
}
