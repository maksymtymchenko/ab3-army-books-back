import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';

const categoryService = new CategoryService(new CategoryRepository());

/**
 * Controller for category endpoints.
 */
export class CategoryController {
  static async getCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await categoryService.getAll();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
