import mongoose, { Model, InferSchemaType } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    coverImage: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;

export default (mongoose.models.Category as Model<CategoryDoc> | undefined) ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);
