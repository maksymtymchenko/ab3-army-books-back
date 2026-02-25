import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  iconUrl: string;
  href?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    iconUrl: { type: String, required: true, trim: true },
    href: { type: String, trim: true }
  },
  {
    timestamps: true
  }
);

categorySchema.index({ name: 1 });

export const CategoryModel = model<ICategory>('Category', categorySchema);
