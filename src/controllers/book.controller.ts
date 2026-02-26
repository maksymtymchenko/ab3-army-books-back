import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { BookRepository } from '../repositories/book.repository';

const bookService = new BookService(new BookRepository());

/**
 * Controller for book endpoints.
 */
export class BookController {
  static async getHome(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limitParam = req.query.limit;
      const limit =
        typeof limitParam === 'string' ? parseInt(limitParam, 10) : undefined;

      const data = await bookService.getHomeSections(limit);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getCatalog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page,
        pageSize,
        author,
        status,
        difficulty,
        sortBy,
        sortOrder,
        section
      } = req.query as any;

      const pageNum = Number(page) || 1;
      const pageSizeNum = Number(pageSize) || 12;

      const toArray = (value: unknown): string[] | undefined => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value as string[];
        return [String(value)];
      };

      const filters = {
        authors: toArray(author),
        statuses: toArray(status) as any,
        difficulties: toArray(difficulty) as any
      };

      const sort = {
        sortBy: (sortBy as 'popularity' | 'title') || 'popularity',
        sortOrder: sortOrder as 'asc' | 'desc' | undefined
      };

      const data = await bookService.getCatalog(
        pageNum,
        pageSizeNum,
        filters,
        sort,
        section as any
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getFilters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { section } = req.query as { section?: any };
      const data = await bookService.getFilters(section as any);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = await bookService.getById(id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async search(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q, limit, status } = req.query as any;
      const limitNum = Number(limit) || 10;

      const data = await bookService.search(q, limitNum, status);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await bookService.deleteBook(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
