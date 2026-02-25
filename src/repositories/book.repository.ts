import { FilterQuery, SortOrder } from 'mongoose';
import { BookModel, IBook } from '../models/book.model';
import {
  BookDifficulty,
  BookSectionTag,
  BookStatus
} from '../utils/constants';

export interface CatalogFilters {
  authors?: string[];
  statuses?: BookStatus[];
  difficulties?: BookDifficulty[];
}

export interface CatalogSort {
  sortBy: 'popularity' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repository for book persistence operations.
 */
export class BookRepository {
  /**
   * Find books for home page sections.
   */
  async findHomeSections(limit?: number): Promise<{
    recommended: IBook[];
    newArrivals: IBook[];
    commanderRecommends: IBook[];
  }> {
    const baseQuery = { status: 'in_stock' as BookStatus };

    const build = (tag: BookSectionTag) =>
      BookModel.find({
        ...baseQuery,
        sectionTags: tag
      })
        .sort({ popularityScore: -1, createdAt: -1 })
        .limit(limit || 8)
        .exec();

    const [recommended, newArrivals, commanderRecommends] =
      await Promise.all([
        build('recommended'),
        build('new'),
        build('commander')
      ]);

    return { recommended, newArrivals, commanderRecommends };
  }

  /**
   * Find catalog books with filters and pagination.
   */
  async findCatalog(
    page: number,
    pageSize: number,
    filters: CatalogFilters,
    sort: CatalogSort,
    section?: BookSectionTag
  ): Promise<{ items: IBook[]; total: number }> {
    const query: FilterQuery<IBook> = {};

    if (filters.authors?.length) {
      query.author = { $in: filters.authors };
    }
    if (filters.statuses?.length) {
      query.status = { $in: filters.statuses };
    }
    if (filters.difficulties?.length) {
      query.difficulty = { $in: filters.difficulties };
    }
    if (section) {
      query.sectionTags = section;
    }

    const sortField = sort.sortBy === 'popularity' ? 'popularityScore' : 'title';
    let order: SortOrder;
    if (sort.sortOrder) {
      order = sort.sortOrder === 'asc' ? 1 : -1;
    } else {
      order = sort.sortBy === 'popularity' ? -1 : 1;
    }

    const [items, total] = await Promise.all([
      BookModel.find(query)
        .sort({ [sortField]: order })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      BookModel.countDocuments(query).exec()
    ]);

    return { items, total };
  }

  /**
   * Get distinct authors, optionally scoped by section tag.
   */
  async getDistinctAuthors(section?: BookSectionTag): Promise<string[]> {
    const query: FilterQuery<IBook> = {};
    if (section) {
      query.sectionTags = section;
    }
    return BookModel.distinct('author', query).exec();
  }

  /**
   * Find a book by id.
   */
  async findById(id: string): Promise<IBook | null> {
    return BookModel.findById(id).exec();
  }

  /**
   * Search for books using text index.
   */
  async search(
    q: string,
    limit: number,
    status?: BookStatus
  ): Promise<IBook[]> {
    const query: FilterQuery<IBook> = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    };
    if (status) {
      query.status = status;
    }
    return BookModel.find(query).limit(limit).exec();
  }

  /**
   * Count search results for a query.
   */
  async countSearch(q: string, status?: BookStatus): Promise<number> {
    const query: FilterQuery<IBook> = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    };
    if (status) {
      query.status = status;
    }
    return BookModel.countDocuments(query).exec();
  }

  /**
   * Atomically mark book as reserved if currently in stock.
   */
  async setStatusReserved(id: string): Promise<IBook | null> {
    return BookModel.findOneAndUpdate(
      { _id: id, status: 'in_stock' },
      { $set: { status: 'reserved' } },
      { new: true }
    ).exec();
  }
}
