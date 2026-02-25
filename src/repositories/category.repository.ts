import { CategoryModel, ICategory } from '../models/category.model';

/**
 * Repository for category persistence operations.
 */
export class CategoryRepository {
  /**
   * Get all categories sorted by name.
   */
  async findAll(): Promise<ICategory[]> {
    return CategoryModel.find().sort({ name: 1 }).exec();
  }
}
