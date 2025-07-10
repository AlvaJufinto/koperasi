import { useEffect, useState } from "react";

async function downscaleImage(
  src: string,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve(src); // Fallback: return original if context is null

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve(src); // Fallback on error
  });
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({
  src,
  alt,
  className = "",
}: LazyImageProps) {
  const [lowResSrc, setLowResSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function generateLowRes() {
      const lowRes = await downscaleImage(src, 16, 9);
      setLowResSrc(lowRes);
    }
    generateLowRes();
  }, [src]);

  return (
    <img
      loading="lazy"
      src={isLoaded ? src : lowResSrc || src}
      alt={alt}
      className={`w-full h-full object-cover flex-shrink-0 transition-opacity duration-700 ease-in-out ${className} ${
        isLoaded ? "opacity-100 blur-0" : "opacity-10 blur-lg"
      }`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
