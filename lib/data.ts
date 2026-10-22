export const WA = "201205635310"; 

export type Kind = "bed" | "dining" | "sofa" | "kids";
export const HERO_IMAGES: string[] = [  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",];

  export type CatalogCategory = { id: string; name: string };
export type Product = {
  id: string;
  category: string;
  name: string;
  material: string;
  dimensions: string;
  color: string;
  description: string;
  image: string;
  images?: string[];
};

export type Category = {
  name: string;
  kind: Kind;
  items: [name: string, material: string, dimensions: string, color: string][];
};

export const CATEGORIES: Category[] = [
  {
    name: "غرف النوم",
    kind: "bed",
    items: [
      ["غرفة نوم مودرن", "خشب زان", "سرير 180×200 سم", "بيج / بني"],
      ["غرفة نوم كلاسيك", "خشب موسكي", "سرير 160×200 سم", "عاجي"],
      ["غرفة نوم ماستر", "MDF مستورد", "سرير 200×200 سم", "رمادي"],
      ["غرفة نوم هادية", "خشب زان", "سرير 150×200 سم", "بني فاتح"],
    ],
  },
  {
    name: "غرف السفرة",
    kind: "dining",
    items: [
      ["سفرة 6 كراسي", "خشب زان", "ترابيزة 180×90 سم", "بني غامق"],
      ["سفرة 8 كراسي", "خشب موسكي", "ترابيزة 240×100 سم", "عاجي / ذهبي"],
      ["سفرة مودرن", "MDF مستورد", "ترابيزة 160×80 سم", "رمادي"],
      ["سفرة مع نيش", "خشب زان", "نيش 120×45 سم", "جوزي"],
    ],
  },
  {
    name: "الصالونات",
    kind: "sofa",
    items: [
      ["صالون ركنة", "قماش مقاوم", "ركنة 300×220 سم", "أخضر زيتي"],
      ["صالون كلاسيك", "خشب وقماش", "طقم 3+2+1", "بيج"],
      ["كنبة ثلاثية", "قماش كتان", "220×95 سم", "رمادي فاتح"],
      ["صالون مودرن", "جلد صناعي", "طقم 3+2+1", "بني"],
    ],
  },
  {
    name: "غرف الأطفال",
    kind: "kids",
    items: [
      ["سرير دورين", "خشب زان", "90×190 سم", "أبيض / خشبي"],
      ["غرفة بنات", "MDF مستورد", "سرير 120×200 سم", "وردي هادي"],
      ["غرفة أولاد", "خشب موسكي", "سرير 120×200 سم", "أزرق"],
      ["مكتب مذاكرة", "MDF مستورد", "120×60 سم", "بيج"],
    ],
  },
];

/* صور بديلة SVG لحد ما نربط Cloudinary */
const ICONS: Record<Kind, string> = {
  bed: '<path d="M40 150h240v50H40zM40 100v100M280 120v80M60 100h90v50H60z"/>',
  dining: '<path d="M70 120h180v14H70zM90 134v60M230 134v60M30 150v44M290 150v44"/>',
  sofa: '<path d="M60 110h200v50H60zM30 140h40v50H30zM250 140h40v50h-40zM70 160h180v30H70z"/>',
  kids: '<path d="M70 90h180v30H70zM70 150h180v30H70zM70 90v100M250 90v100M70 120h180"/>',
};

const PALETTE = [
  ["#F8D2BF", "#D9603B"],
  ["#F6DCCD", "#E8795A"],
  ["#F3C7B2", "#B5503A"],
  ["#FAE0D2", "#C8532F"],
];

/* خلفية خطوط وأشكال هندسية خفيفة ومعمارية بدل الأثاث */
export const BG_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240' fill='none' stroke='%23D9603B' stroke-opacity='.075' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M0 48A48 48 0 0 0 48 0M0 80A80 80 0 0 0 80 0'/%3E%3Cpath d='M240 192A48 48 0 0 0 192 240M240 160A80 80 0 0 0 160 240'/%3E%3Cpolygon points='170,36 196,62 170,88 144,62'/%3E%3Ccircle cx='170' cy='62' r='8'/%3E%3Ccircle cx='68' cy='172' r='24'/%3E%3Ccircle cx='68' cy='172' r='6'/%3E%3Cpath d='M44 172h48M68 148v48' stroke-opacity='.05'/%3E%3Cpath d='M110 110l36-36M122 122l36-36M134 134l36-36'/%3E%3Cpath d='M24 108h32M40 92v32M188 124h24M200 112v24'/%3E%3Crect x='136' y='156' width='28' height='28' rx='6' transform='rotate(15 150 170)'/%3E%3C/svg%3E")`;

export function placeholder(kind: Kind, i: number): string {  const [a, b] = PALETTE[i % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g transform="translate(40 0)" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">${ICONS[kind]}</g></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export const PRODUCTS: Product[] = CATEGORIES.flatMap((c, ci) =>
  c.items.map(([name, material, dimensions, color], ii) => ({
    id: `p${ci}${ii}`,
    category: c.name,
    name,
    material,
    dimensions,
    color,
    description:
      "تصميم عملي بتشطيب ناعم يناسب المساحات المختلفة. تقدر تغيّر المقاس واللون حسب طلبك.",
    image: placeholder(c.kind, ii),
  }))
);
