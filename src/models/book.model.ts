import { Schema, model, Document } from 'mongoose';
import {
  BookDifficulty,
  BookSectionTag,
  BookStatus,
  BOOK_DIFFICULTY,
  BOOK_SECTION_TAGS,
  BOOK_STATUS
} from '../utils/constants';

export interface IBook extends Document {
  title: string;
  author: string;
  coverUrl: string;
  status: BookStatus;
  description?: string;
  difficulty?: BookDifficulty;
  popularityScore?: number;
  sectionTags?: BookSectionTag[];
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    coverUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: BOOK_STATUS,
      default: 'in_stock'
    },
    description: { type: String, trim: true },
    difficulty: {
      type: String,
      enum: BOOK_DIFFICULTY
    },
    popularityScore: {
      type: Number,
      default: 0,
      index: true
    },
    sectionTags: {
      type: [String],
      enum: BOOK_SECTION_TAGS,
      index: true
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ status: 1 });
bookSchema.index({ difficulty: 1 });

export const BookModel = model<IBook>('Book', bookSchema);
