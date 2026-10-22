"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSlideshow({
  images,
  interval = 5000,
}: {
  images: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval, index]);

  return (
    <>
      <div className="absolute inset-0 -z-10 bg-[#7A2A2A]" aria-hidden="true">
        {images.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "scale(1.08)" : "scale(1)",
              transition: "opacity 1.5s ease-in-out, transform 7s ease-out",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
      </div>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`الصورة ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
