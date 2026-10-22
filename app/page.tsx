import Image from "next/image";
import CatalogClient from "../components/CatalogClient";
import HeroSlideshow from "../components/HeroSlideshow";
import { BG_PATTERN, HERO_IMAGES, WA } from "../lib/data";
import { getCatalog } from "../lib/catalog";
import { featureIcon, WhatsAppIcon } from "../components/Icons";
import MobileMenu from "../components/MobileMenu";
export const revalidate = 3600;

export default async function Home() {
  const { categories, products } = await getCatalog();
  const categoryNames = categories.map((c) => c.name);

  const heroImages =
    HERO_IMAGES.length > 0
      ? HERO_IMAGES
      : categories
          .map((c) => products.find((p) => p.category === c.name)?.image)
          .filter((src): src is string => Boolean(src));

  return (
    <div
      dir="rtl"
      style={{ backgroundImage: BG_PATTERN }}
      className="min-h-screen bg-[#FBF4EE] text-[17px] leading-[1.8] text-[#3B2A25] [font-family:var(--font-plex),Tahoma,Arial,sans-serif] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] before:fixed before:inset-x-0 before:top-0 before:z-30 before:h-[env(safe-area-inset-top,0px)] before:bg-white before:content-[''] [&_*:focus-visible]:outline [&_*:focus-visible]:outline-[3px] [&_*:focus-visible]:outline-offset-2 [&_*:focus-visible]:outline-[#E8795A] motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!scroll-auto"
    >
<header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-[#F0DDD1] bg-[#FFF7F0] text-[#3B2A25] shadow-[0_2px_12px_rgba(200,83,47,0.08)] backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between px-5 min-[860px]:h-[70px]">
          <a href="#top" aria-label="الرئيسية" className="flex items-center">
            <Image
              src="/logo.png"
              alt="معرض الأثاث"
              width={479}
              height={281}
              priority
              className="block h-[90px] w-[90px] w-auto drop-shadow-[0_1px_2px_rgba(122,42,42,0.25)] min-[860px]:h-[72px]"
            />
          </a>
          <nav className="hidden gap-[26px] font-semibold min-[860px]:flex">
            <a href="#top" className="text-[17px] font-semibold transition hover:text-[#E8795A]">
              الرئيسية
            </a>
            <a href="#about" className="text-[17px] font-semibold transition hover:text-[#E8795A]">
              عن المعرض
            </a>
            {categories.map((c, i) => (
              <a
                key={c.id}
                href={`#cat-${i}`}
                className="text-[17px] font-semibold transition hover:text-[#E8795A]"
              >
                {c.name}
              </a>
            ))}
          </nav>
          <MobileMenu categoryNames={categoryNames} />
        </div>
      </header>

      <main id="top" className="scroll-mt-[calc(100px+env(safe-area-inset-top,0px))]">
        <section className="relative isolate overflow-hidden">
          <HeroSlideshow images={heroImages} />
          <div className="mx-auto flex min-h-[78vh] max-w-[1180px] flex-col items-center justify-center px-5 pt-10 pb-16 text-center">
            <div className="mx-auto mb-3 w-fit  px-5 py-2  ">
              <Image
                src="/logo.png"
                alt="معرض الأثاث"
                width={479}
                height={281}
                priority
                className="block h-auto w-[min(300px,65vw)]"
              />
            </div>
            <h1 className="text-[clamp(34px,7vw,56px)] mt-0 font-extrabold leading-[1.3] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
الخولي للاثاث            </h1>
            <p className="mx-auto mt-3.5 mb-7 max-w-[34em] text-[19px] text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              أثاث بخامات متينة وتصميمات هادية، لكل أوضة في بيتك. تعالى شوف المعروض أو ابعتلنا على واتساب.
            </p>
            <a
              href="#cat-0"
              className="inline-flex items-center gap-2 rounded-[10px] border-0 bg-[#C8532F] px-7 py-3 font-semibold text-white transition hover:brightness-110"
            >
              تصفح المنتجات
            </a>
          </div>
        </section>

        <section
          id="about"
          className="mx-auto mt-12 max-w-[1180px] px-5 scroll-mt-[calc(100px+env(safe-area-inset-top,0px))]"
        >
          <div className="mb-14 rounded-2xl border border-[#F0DDD1] bg-white px-6 py-8 min-[760px]:p-10">
            <h2 className="text-[26px] font-bold text-[#C8532F]">عن المعرض</h2>
            <p className="mt-2 max-w-[46em] text-[#7A6A63]">
              بنصمم ونصنع ونعرض أثاث للبيت من أكتر من عشرين سنة. بنختار الخشب بنفسنا، ونتابع التنفيذ لحد التسليم في بيتك.
            </p>
            <div className="mt-6 grid gap-[18px] min-[760px]:grid-cols-3">
              <div className="flex items-start gap-3.5">
                <svg {...featureIcon} className="h-[34px] w-[34px] shrink-0 text-[#E8795A]">
                  <path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" />
                  <path d="M11 16l4 4 6-8" />
                </svg>
                <p>
                  <b className="block text-[#C8532F]">خامات مضمونة</b>
                  <span className="text-[15px] leading-[1.6] text-[#7A6A63]">
                    خشب طبيعي وتشطيب يتحمل الاستخدام اليومي.
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3.5">
                <svg {...featureIcon} className="h-[34px] w-[34px] shrink-0 text-[#E8795A]">
                  <path d="M4 8h16v14H4zM20 13h5l3 4v5h-8zM9 25a2 2 0 100-.1M24 25a2 2 0 100-.1" />
                </svg>
                <p>
                  <b className="block text-[#C8532F]">توصيل وتركيب</b>
                  <span className="text-[15px] leading-[1.6] text-[#7A6A63]">
                    بنوصل ونركب في مكانك بدون تكلفة إضافية.
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3.5">
                <svg {...featureIcon} className="h-[34px] w-[34px] shrink-0 text-[#E8795A]">
                  <path d="M16 4l3.5 7.5L28 12.6l-6 5.8 1.5 8.2L16 22.4 8.5 26.6 10 18.4 4 12.6l8.5-1.1z" />
                </svg>
                <p>
                  <b className="block text-[#C8532F]">تفصيل حسب الطلب</b>
                  <span className="text-[15px] leading-[1.6] text-[#7A6A63]">
                    غيّر المقاس أو اللون ونحن ننفذه لك.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <CatalogClient categories={categories} products={products} />
      </main>

      <footer className="mt-5 bg-[#7A2A2A] pt-9 pb-11 text-white">
        <div className="mx-auto grid max-w-[1180px] gap-[18px] px-5 min-[760px]:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <b className="text-[20px]">معرض الخولي</b>
            <p className="opacity-85">معرض أثاث منزلي.</p>
          </div>
          <div>
            <b className="text-[20px]">تواصل معنا</b>
            <p className="opacity-85">
              الهاتف:  +20 12 05635310
              <br />
              السبت – الخميس: 10 صباحًا – 9 مساءً
            </p>
          </div>
          <div>
            <b className="text-[20px]">العنوان</b>
            <p className="opacity-85">دمياط - الشعراء</p>
          </div>
        </div>
      </footer>

      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        href={`https://wa.me/${WA}?text=${encodeURIComponent("أهلًا، عايز أستفسر عن منتجات المعرض")}`}
        className="fixed bottom-[calc(18px+env(safe-area-inset-bottom,0px))] left-[18px] z-[15] grid h-14 w-14 place-content-center rounded-full bg-[#1FA855] text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}