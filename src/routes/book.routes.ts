import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { validate } from '../middlewares/validation';
import {
  createBookBodySchema,
  getBookByIdParamsSchema,
  getCatalogBooksQuerySchema,
  getFiltersQuerySchema,
  getHomeBooksQuerySchema,
  searchBooksQuerySchema
} from '../utils/validationSchemas';

const router = Router();

router.get(
  '/home',
  validate(getHomeBooksQuerySchema, 'query'),
  BookController.getHome
);

router.get(
  '/',
  validate(getCatalogBooksQuerySchema, 'query'),
  BookController.getCatalog
);

router.get(
  '/filters',
  validate(getFiltersQuerySchema, 'query'),
  BookController.getFilters
);

router.get(
  '/search',
  validate(searchBooksQuerySchema, 'query'),
  BookController.search
);

router.post('/', validate(createBookBodySchema, 'body'), BookController.create);

router.get(
  '/:id',
  validate(getBookByIdParamsSchema, 'params'),
  BookController.getById
);

router.delete(
  '/:id',
  validate(getBookByIdParamsSchema, 'params'),
  BookController.delete
);

export const bookRoutes = router;
