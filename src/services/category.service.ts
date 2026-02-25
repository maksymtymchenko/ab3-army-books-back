import { CategoryRepository } from '../repositories/category.repository';
import { mapCategory } from '../utils/mapper';

/**
 * Service for category-related business logic.
 */
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  /**
   * Get all categories for home page.
   */
  async getAll() {
    const items = await this.categoryRepo.findAll();
    return {
      items: items.map(mapCategory)
    };
  }
}
