"use client";

import { useEffect, useRef, useState } from "react";
import { WA, type CatalogCategory, type Product } from "../lib/data";
import { WhatsAppIcon } from "./Icons";

function CategorySlider({
  index,
  category,
  products,
  onOpen,
}: {
  index: number;
  category: string;
  products: Product[];
  onOpen: (id: string) => void;
}) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section
      id={`cat-${index}`}
      className="mb-14 scroll-mt-[calc(100px+env(safe-area-inset-top,0px))]"
    >
      <div className="mb-[18px] flex items-end justify-between gap-3">
        <h2 className="text-[28px] font-bold leading-[1.3] text-[#C8532F] after:mt-1.5 after:block after:h-[3px] after:w-14 after:rounded-[2px] after:bg-[#E8795A] after:content-['']">
          {category}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(1)}
            aria-label="التالي"
            className="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-[#F0DDD1] bg-white text-[#C8532F] transition hover:bg-[#C8532F] hover:text-white"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(-1)}
            aria-label="السابق"
            className="grid h-[42px] w-[42px] cursor-pointer place-content-center rounded-full border border-[#F0DDD1] bg-white text-[#C8532F] transition hover:bg-[#C8532F] hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="flex gap-4 overflow-x-auto px-0.5 pt-1 pb-3.5 snap-x snap-mandatory [scrollbar-width:thin]"
      >
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p.id)}
            aria-label={`عرض تفاصيل ${p.name}`}
            className="group relative flex-[0_0_88%] min-[620px]:basis-[calc(60%-8px)] min-[960px]:basis-[calc(33.333%-11px)] snap-start cursor-pointer overflow-hidden rounded-2xl border border-[#F0DDD1] bg-white p-0 shadow-[0_6px_18px_rgba(200,83,47,0.10)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={p.image}
              alt={p.name}
              className="block aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {p.images && p.images.length > 1 && (
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[13px] font-semibold text-white">
                {p.images.length} صور
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function CatalogClient({
  categories,
  products,
}: {
  categories: CatalogCategory[];
  products: Product[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const active = products.find((p) => p.id === activeId) ?? null;

  const gallery = active
    ? active.images && active.images.length > 0
      ? active.images
      : [active.image]
    : [];
  const currentImage = gallery[imgIndex] ?? gallery[0];

  const openProduct = (id: string) => {
    setImgIndex(0);
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const closeProduct = () => {
    setActiveId(null);
    setImgIndex(0);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  const step = (dir: 1 | -1) => {
    if (gallery.length < 2) return;
    setImgIndex((i) => (i + dir + gallery.length) % gallery.length);
  };

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (products.some((p) => p.id === id)) setActiveId(id);
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = activeId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeId) return;
      if (e.key === "Escape") closeProduct();
      if (e.key === "ArrowLeft") step(1);
      if (e.key === "ArrowRight") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeId, gallery.length]);

  const waProductLink = (p: Product) => {
    const url =
      (typeof window !== "undefined" ? window.location.href.split("#")[0] : "") +
      "#" +
      p.id;
    const text = `أهلًا، عايز أسأل عن: ${p.name} (${p.category})\n${url}`;
    return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <div id="cats" className="mx-auto max-w-[1180px] px-5">
        {categories.map((c, i) => (
          <CategorySlider
            key={c.id}
            index={i}
            category={c.name}
            products={products.filter((p) => p.category === c.name)}
            onOpen={openProduct}
          />
        ))}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={active?.name}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeProduct();
        }}
        className={`fixed inset-0 z-40 flex items-end justify-center bg-[rgba(20,16,12,0.6)] transition-all duration-250 min-[820px]:items-center ${
          active ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className={`relative max-h-[92%] w-full overflow-auto rounded-t-[20px] bg-white pb-[env(safe-area-inset-bottom,0px)] transition-transform duration-300 min-[820px]:grid min-[820px]:max-h-[86%] min-[820px]:w-[min(920px,92%)] min-[820px]:grid-cols-[1.1fr_1fr] min-[820px]:rounded-[20px] ${
            active ? "translate-y-0" : "translate-y-10"
          }`}
        >
          <button
            onClick={closeProduct}
            aria-label="إغلاق"
            className="absolute top-3 left-3 z-[3] h-[42px] w-[42px] cursor-pointer rounded-full border-0 bg-[rgba(20,16,12,0.6)] text-[24px] leading-none text-white"
          >
            ×
          </button>
          {active && (
            <>
              <div className="flex flex-col bg-[#FBF4EE]">
                <div className="relative min-[820px]:min-h-[420px] min-[820px]:flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt={active.name}
                    className="block aspect-[4/3] w-full object-cover min-[820px]:absolute min-[820px]:inset-0 min-[820px]:aspect-auto min-[820px]:h-full"
                  />
                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => step(-1)}
                        aria-label="الصورة السابقة"
                        className="absolute top-1/2 right-3 z-[2] grid h-10 w-10 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-white/85 text-[22px] text-[#C8532F] shadow transition hover:bg-white"
                      >
                        ›
                      </button>
                      <button
                        onClick={() => step(1)}
                        aria-label="الصورة التالية"
                        className="absolute top-1/2 left-3 z-[2] grid h-10 w-10 -translate-y-1/2 cursor-pointer place-content-center rounded-full bg-white/85 text-[22px] text-[#C8532F] shadow transition hover:bg-white"
                      >
                        ‹
                      </button>
                    </>
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-2.5 [scrollbar-width:thin]">
                    {gallery.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        onClick={() => setImgIndex(i)}
                        aria-label={`عرض الصورة ${i + 1}`}
                        aria-current={i === imgIndex}
                        className={`w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-0 transition ${
                          i === imgIndex ? "border-[#C8532F]" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="block aspect-[4/3] w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-[22px] pt-5 pb-[26px] min-[820px]:self-center min-[820px]:px-8 min-[820px]:py-9">
                <small className="font-semibold text-[#E8795A]">{active.category}</small>
                <h3 className="text-[26px] font-bold leading-[1.4] text-[#C8532F]">{active.name}</h3>
                <p className="mt-2 mb-3.5 text-[#7A6A63]">{active.description}</p>
                <dl className="mb-[22px] grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[16px]">
                  <dt className="text-[#7A6A63]">الخامة</dt>
                  <dd className="font-semibold">{active.material}</dd>
                  <dt className="text-[#7A6A63]">المقاس</dt>
                  <dd className="font-semibold">{active.dimensions}</dd>
                  <dt className="text-[#7A6A63]">اللون</dt>
                  <dd className="font-semibold">{active.color}</dd>
                </dl>
                <a
                  href={waProductLink(active)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1FA855] px-5 py-[13px] font-semibold text-white transition hover:brightness-[1.08]"
                >
                  <WhatsAppIcon />
                  اسأل عن المنتج ده على واتساب
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}