import mongoose, { Model, InferSchemaType } from "mongoose";

const ImageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    material: { type: String, default: "" },
    price: { type: Number, default: null }, // optional
    // images[0] is the main image; reorder the array to change it.
    images: { type: [ImageSchema], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

export default (mongoose.models.Product as Model<ProductDoc> | undefined) ||
  mongoose.model<ProductDoc>("Product", ProductSchema);
