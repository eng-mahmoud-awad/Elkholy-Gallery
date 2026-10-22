"use client";

import { useEffect, useState } from "react";

export default function MobileMenu({ categoryNames }: { categoryNames: string[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // تفعيل السكرول الناعم وإغلاق القائمة بزر Escape
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, []);

  return (
    <>
      <button
        aria-label="القائمة"
        aria-expanded={menuOpen}
        aria-controls="drawer"
        onClick={() => setMenuOpen((o) => !o)}
        className="grid h-11 w-11 cursor-pointer place-content-center gap-[5px] border-0 bg-transparent min-[860px]:hidden"
      >
        <i
          className={`block h-[2.5px] w-6 rounded-[2px] bg-[#C8532F] transition duration-250 ${
            menuOpen ? "translate-y-[7.5px] rotate-45" : ""
          }`}
        />
        <i
          className={`block h-[2.5px] w-6 rounded-[2px] bg-[#C8532F] transition duration-250 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <i
          className={`block h-[2.5px] w-6 rounded-[2px] bg-[#C8532F] transition duration-250 ${
            menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        id="drawer"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[25] bg-[rgba(20,16,12,0.5)] transition-all duration-250 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-0 right-0 bottom-0 flex w-[min(80%,320px)] flex-col bg-white px-6 pt-[calc(84px+env(safe-area-inset-top,0px))] pb-6 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="contents" onClick={() => setMenuOpen(false)}>
            <a
              href="#top"
              className="border-b border-[#F0DDD1] py-3.5 px-1 text-[18px] font-semibold transition hover:text-[#E8795A]"
            >
              الرئيسية
            </a>
            <a
              href="#about"
              className="border-b border-[#F0DDD1] py-3.5 px-1 text-[18px] font-semibold transition hover:text-[#E8795A]"
            >
              عن المعرض
            </a>
            {categoryNames.map((name, i) => (
              <a
                key={name}
                href={`#cat-${i}`}
                className="border-b border-[#F0DDD1] py-3.5 px-1 text-[18px] font-semibold transition hover:text-[#E8795A]"
              >
                {name}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
