import mongoose, { Model, InferSchemaType } from "mongoose";

// Singleton document: always read/written with { key: "main" }.
const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    whatsappNumber: { type: String, default: "" },
    aboutText: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema>;

export default (mongoose.models.Settings as Model<SettingsDoc> | undefined) ||
  mongoose.model<SettingsDoc>("Settings", SettingsSchema);
