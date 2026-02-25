import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validation';
import { getCategoriesQuerySchema } from '../utils/validationSchemas';

const router = Router();

router.get(
  '/',
  validate(getCategoriesQuerySchema, 'query'),
  CategoryController.getCategories
);

export const categoryRoutes = router;
