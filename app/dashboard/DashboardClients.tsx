"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { deleteCategory, deleteProduct, addCategory, addProduct, editCategory, editProduct } from "./actions";
import ImageUploader, { UploadedImage } from "../../components/ImageUploader";

type Product = {
  id: string;
  name: string;
  material: string | null;
  dimensions: string | null;
  color: string | null;
  description: string | null;
  image: string | null;
};

type Category = {
  id: string;
  name: string;
  kind: string | null;
  products: Product[];
};

export default function DashboardClient({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();

  const [catModal, setCatModal] = useState<{ isOpen: boolean; data?: Category | null }>({ isOpen: false });
  const [prodModal, setProdModal] = useState<{ isOpen: boolean; catId?: string; data?: Product | null }>({ isOpen: false });
  const [productImages, setProductImages] = useState<UploadedImage[]>([]);

  const openProductModal = (catId?: string, product?: Product | null) => {
    if (product && product.image) {
      setProductImages([{ url: product.image, publicId: product.image }]);
    } else {
      setProductImages([]);
    }
    setProdModal({ isOpen: true, catId, data: product });
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم بكل منتجاته نهائياً؟")) return;
    startTransition(async () => {
      const t = toast.loading("جاري حذف القسم...");
      try {
        await deleteCategory(id);
        toast.success("تم حذف القسم", { id: t });
      } catch {
        toast.error("تعذر حذف القسم، حاول مرة أخرى", { id: t });
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    startTransition(async () => {
      const t = toast.loading("جاري حذف المنتج...");
      try {
        await deleteProduct(id);
        toast.success("تم حذف المنتج", { id: t });
      } catch {
        toast.error("تعذر حذف المنتج، حاول مرة أخرى", { id: t });
      }
    });
  };

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isEdit = Boolean(catModal.data);

    startTransition(async () => {
      const t = toast.loading("جاري الحفظ...");
      try {
        if (catModal.data) await editCategory(catModal.data.id, formData);
        else await addCategory(formData);
        toast.success(isEdit ? "تم تعديل القسم" : "تمت إضافة القسم", { id: t });
        setCatModal({ isOpen: false });
      } catch {
        toast.error("تعذر حفظ القسم، حاول مرة أخرى", { id: t });
      }
    });
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isEdit = Boolean(prodModal.data);

    if (prodModal.catId) formData.append("categoryId", prodModal.catId);
    if (productImages.length > 0) {
formData.append("images", JSON.stringify(productImages));    }

    startTransition(async () => {
      const t = toast.loading("جاري الحفظ...");
      try {
        if (prodModal.data) await editProduct(prodModal.data.id, formData);
        else await addProduct(formData);
        toast.success(isEdit ? "تم تعديل المنتج" : "تمت إضافة المنتج", { id: t });
        setProdModal({ isOpen: false });
      } catch {
        toast.error("تعذر حفظ المنتج، حاول مرة أخرى", { id: t });
      }
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBF4EE] p-6 lg:p-10 relative">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#C8532F]">لوحة التحكم</h1>
          <p className="mt-2 text-[#7A2A2A]">إدارة الأقسام والمنتجات</p>
        </div>
        <button
          onClick={() => setCatModal({ isOpen: true, data: null })}
          className="rounded-xl bg-[#C8532F] px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-[#a64223]"
        >
          + إضافة قسم جديد
        </button>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-[#F0DDD1] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#F0DDD1] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#7A2A2A]">{category.name}</h2>
                {category.kind && <span className="text-sm text-[#E8795A]">{category.kind}</span>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openProductModal(category.id, null)}
                  className="rounded-lg border-2 border-[#E8795A] bg-[#FBF4EE] px-4 py-2 text-[14px] font-semibold text-[#C8532F] transition hover:bg-white"
                >
                  + إضافة منتج
                </button>
                <button
                  onClick={() => setCatModal({ isOpen: true, data: category })}
                  className="rounded-lg bg-[#FBF4EE] px-4 py-2 text-[14px] font-semibold text-[#C8532F] transition hover:bg-[#F0DDD1]"
                >
                  تعديل القسم
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={isPending}
                  className="rounded-lg bg-[#fdf0ef] px-4 py-2 text-[14px] font-semibold text-[#B42318] transition hover:bg-[#fadcd9] disabled:opacity-50"
                >
                  حذف القسم
                </button>
              </div>
            </div>

            {category.products.length === 0 ? (
              <p className="text-center text-[#7A2A2A] py-8">لا يوجد منتجات في هذا القسم.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.products.map((product) => (
                  <div key={product.id} className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#F0DDD1] bg-white transition hover:shadow-md">
                    {product.image && (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-4 space-y-2">
                      <h3 className="text-[17px] font-bold text-[#7A2A2A]">{product.name}</h3>
                      <div className="text-[13px] text-[#5e2121] space-y-1">
                        {product.material && <p><span className="font-bold">الخامة:</span> {product.material}</p>}
                        {product.dimensions && <p><span className="font-bold">المقاس:</span> {product.dimensions}</p>}
                        {product.color && <p><span className="font-bold">اللون:</span> {product.color}</p>}
                      </div>
                      {product.description && (
                        <p className="text-[12px] text-gray-500 line-clamp-2 mt-2">{product.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 p-4 pt-0 mt-auto">
                      <button
                        onClick={() => openProductModal(undefined, product)}
                        className="flex-1 rounded-lg bg-[#FBF4EE] py-2 text-[13px] font-semibold text-[#C8532F] transition hover:bg-[#F0DDD1]"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={isPending}
                        className="flex-1 rounded-lg bg-[#fdf0ef] py-2 text-[13px] font-semibold text-[#B42318] transition hover:bg-[#fadcd9] disabled:opacity-50"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {catModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#C8532F] mb-4">
              {catModal.data ? "تعديل القسم" : "إضافة قسم جديد"}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#7A2A2A]">اسم القسم</label>
                <input name="name" defaultValue={catModal.data?.name} required className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#7A2A2A]">النوع (اختياري)</label>
                <input name="kind" defaultValue={catModal.data?.kind || ""} className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
              </div>
              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-[#C8532F] py-2.5 text-white hover:bg-[#a64223] disabled:opacity-50">
                  {isPending ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button type="button" onClick={() => setCatModal({ isOpen: false })} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-gray-700 hover:bg-gray-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {prodModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#C8532F] mb-4">
              {prodModal.data ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#7A2A2A]">صورة المنتج</label>
                <ImageUploader
                  value={productImages}
                  onChange={setProductImages}
                  max={1}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#7A2A2A]">اسم المنتج</label>
                <input name="name" defaultValue={prodModal.data?.name} required className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-[#7A2A2A]">الخامة</label>
                  <input name="material" defaultValue={prodModal.data?.material || ""} className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#7A2A2A]">اللون</label>
                  <input name="color" defaultValue={prodModal.data?.color || ""} className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#7A2A2A]">المقاسات</label>
                <input name="dimensions" defaultValue={prodModal.data?.dimensions || ""} className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A]" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[#7A2A2A]">الوصف</label>
                <textarea name="description" defaultValue={prodModal.data?.description || ""} rows={3} className="w-full rounded-xl border border-[#F0DDD1] p-2.5 outline-none focus:border-[#E8795A] resize-none" />
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-[#C8532F] py-2.5 text-white hover:bg-[#a64223] disabled:opacity-50">
                  {isPending ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button type="button" onClick={() => setProdModal({ isOpen: false })} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-gray-700 hover:bg-gray-200">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}