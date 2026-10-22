// app/admin/page.tsx
import DashboardClient from "./DashboardClients";
import { PrismaClient } from "@prisma/client" ;

const prisma = new PrismaClient(); // تأكد من مسار الاستدعاء حسب مشروعك

// بنجبر الصفحة تجيب الداتا الطازجة وماتعملش كاش قديم
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // جلب الأقسام مع المنتجات الخاصة بكل قسم
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' }, // الترتيب بناءً على حقل order
    include: {
      products: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return <DashboardClient categories={categories} />;
}