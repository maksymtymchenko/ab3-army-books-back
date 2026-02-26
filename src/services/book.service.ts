import {
  BookRepository,
  CatalogFilters,
  CatalogSort
} from '../repositories/book.repository';
import { buildPaginationMeta } from '../utils/pagination';
import {
  mapBook,
  mapBookListItem,
  mapBookSearchItem
} from '../utils/mapper';
import { ERROR_CODES } from '../utils/constants';
import {
  InvalidParamsError,
  InvalidQueryError,
  NotFoundError
} from '../utils/ApiError';
import { statusLabels, difficultyLabels } from '../utils/localization';
import { BookSectionTag } from '../utils/constants';

/**
 * Service for book-related business logic.
 */
export class BookService {
  constructor(private readonly bookRepo: BookRepository) {}

  /**
   * Get books for home page sections.
   */
  async getHomeSections(limit?: number) {
    const sections = await this.bookRepo.findHomeSections(limit);
    return {
      recommended: sections.recommended.map(mapBookListItem),
      newArrivals: sections.newArrivals.map(mapBookListItem),
      commanderRecommends: sections.commanderRecommends.map(mapBookListItem)
    };
  }

  /**
   * Get catalog books with filters and pagination.
   */
  async getCatalog(
    page: number,
    pageSize: number,
    filters: CatalogFilters,
    sort: CatalogSort,
    section?: BookSectionTag
  ) {
    if (page < 1 || pageSize < 1) {
      throw new InvalidParamsError('Page and pageSize must be positive integers');
    }

    const { items, total } = await this.bookRepo.findCatalog(
      page,
      pageSize,
      filters,
      sort,
      section
    );

    return {
      items: items.map(mapBookListItem),
      ...buildPaginationMeta(page, pageSize, total),
      appliedFilters: {
        authors: filters.authors || [],
        statuses: filters.statuses || [],
        difficulties: filters.difficulties || [],
        sortBy: sort.sortBy
      }
    };
  }

  /**
   * Get filter options for authors, statuses, difficulties.
   */
  async getFilters(section?: BookSectionTag) {
    const authors = await this.bookRepo.getDistinctAuthors(section);

    const statuses = Object.entries(statusLabels).map(([value, label]) => ({
      value,
      label
    }));

    const difficulties = Object.entries(difficultyLabels).map(
      ([id, label]) => ({
        id,
        label
      })
    );

    return {
      authors,
      statuses,
      difficulties
    };
  }

  /**
   * Get single book by id.
   */
  async getById(id: string) {
    const book = await this.bookRepo.findById(id);
    if (!book) {
      throw new NotFoundError(
        ERROR_CODES.BOOK_NOT_FOUND,
        'Book with given id not found'
      );
    }
    const mapped = mapBook(book);
    if (!mapped) {
      throw new NotFoundError(
        ERROR_CODES.BOOK_NOT_FOUND,
        'Book with given id not found'
      );
    }
    return mapped;
  }

  /**
   * Search books by query and optional status.
   */
  async search(q: string, limit: number, status?: string) {
    if (!q || q.trim().length < 2) {
      throw new InvalidQueryError('Query must be at least 2 characters');
    }

    const items = await this.bookRepo.search(
      q.trim(),
      limit,
      status as any
    );
    const totalItems = await this.bookRepo.countSearch(
      q.trim(),
      status as any
    );

    return {
      items: items.map(mapBookSearchItem),
      totalItems
    };
  }

  /**
   * Create a new book.
   */
  async createBook(input: {
    title: string;
    author: string;
    coverUrl: string;
    status: string;
    description?: string;
    difficulty?: string;
    popularityScore?: number;
    sectionTags?: string[];
  }) {
    const created = await this.bookRepo.create(input as any);
    const mapped = mapBook(created);
    return mapped!;
  }

  /**
   * Delete a book by id.
   */
  async deleteBook(id: string) {
    const deleted = await this.bookRepo.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(
        ERROR_CODES.BOOK_NOT_FOUND,
        'Book with given id not found'
      );
    }
  }
}
