import { Document, Types } from 'mongoose';
import { IBook } from '../models/book.model';
import { ICategory } from '../models/category.model';
import { IReservation } from '../models/reservation.model';

type WithId<T> = Omit<T, keyof Document> & { id: string };

const mapId = (doc: Document & { _id: Types.ObjectId }): string =>
  doc._id.toString();

/**
 * Map full book document to API book shape.
 */
export const mapBook = (doc: (Document & IBook) | null): WithId<IBook> | null =>
  doc
    ? {
        id: mapId(doc),
        title: doc.title,
        author: doc.author,
        coverUrl: doc.coverUrl,
        status: doc.status,
        description: doc.description,
        difficulty: doc.difficulty,
        popularityScore: doc.popularityScore,
        sectionTags: doc.sectionTags
      }
    : null;

/**
 * Map book to catalog list item shape.
 */
export const mapBookListItem = (
  doc: Document & IBook
): {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: string;
  description?: string;
  difficulty?: string;
  popularityScore?: number;
} => ({
  id: mapId(doc),
  title: doc.title,
  author: doc.author,
  coverUrl: doc.coverUrl,
  status: doc.status,
  description: doc.description,
  difficulty: doc.difficulty,
  popularityScore: doc.popularityScore
});

/**
 * Map book to search result item shape.
 */
export const mapBookSearchItem = (
  doc: Document & IBook
): {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: string;
} => ({
  id: mapId(doc),
  title: doc.title,
  author: doc.author,
  coverUrl: doc.coverUrl,
  status: doc.status
});

/**
 * Map category document to API category shape.
 */
export const mapCategory = (
  doc: Document & ICategory
): {
  id: string;
  name: string;
  iconUrl: string;
  href?: string;
} => ({
  id: mapId(doc),
  name: doc.name,
  iconUrl: doc.iconUrl,
  href: doc.href
});

/** Populated bookId from Mongoose (when using .populate('bookId')). */
function getPopulatedBook(
  doc: Document & IReservation
): (Document & IBook) | undefined {
  const ref = (doc as any).bookId;
  if (ref && typeof ref === 'object' && 'title' in ref) {
    return ref as Document & IBook;
  }
  return undefined;
}

/**
 * Map reservation document (and optional book) to API reservation shape.
 * Includes fullName, phone, subdivision, comment for bot display.
 * Nested book is included when bookId is populated or passed as second arg.
 */
export const mapReservation = (
  doc: Document & IReservation,
  book?: Document & IBook
): {
  id: string;
  bookId: string;
  status: string;
  createdAt: string;
  fullName: string;
  phone: string;
  subdivision: string;
  comment?: string | null;
  book?: {
    id: string;
    title: string;
    author: string;
    status: string;
  };
} => {
  const bookDoc = book ?? getPopulatedBook(doc);
  return {
    id: mapId(doc),
    bookId: (doc.bookId as any)?.toString?.() ?? String(doc.bookId),
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    fullName: doc.fullName ?? '',
    phone: doc.phone ?? '',
    subdivision: doc.subdivision ?? '',
    comment: doc.comment ?? null,
    book: bookDoc
      ? {
          id: mapId(bookDoc),
          title: bookDoc.title,
          author: bookDoc.author,
          status: bookDoc.status
        }
      : undefined
  };
};
