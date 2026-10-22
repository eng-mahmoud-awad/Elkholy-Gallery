import { PrismaClient } from "@prisma/client";
import { CATEGORIES, WA } from "../lib/data";
import "dotenv/config";
// import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // تنظيف ثم إعادة تعبئة (آمن للتشغيل أكثر من مرة)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  for (const [ci, c] of CATEGORIES.entries()) {
    await prisma.category.create({
      data: {
        name: c.name,
        kind: c.kind,
        order: ci,
        products: {
          create: c.items.map(([name, material, dimensions, color], ii) => ({
            name,
            material,
            dimensions,
            color,
            order: ii,
            description:
              "تصميم عملي بتشطيب ناعم يناسب المساحات المختلفة. تقدر تغيّر المقاس واللون حسب طلبك.",
          })),
        },
      },
    });
  }

  if (!(await prisma.settings.findFirst())) {
    await prisma.settings.create({
      data: {
        whatsappNumber: WA,
        aboutText:
          "بنصمم ونصنع ونعرض أثاث للبيت من أكتر من عشرين سنة. بنختار الخشب بنفسنا، ونتابع التنفيذ لحد التسليم في بيتك.",
      },
    });
  }

  console.log("Seed done ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
