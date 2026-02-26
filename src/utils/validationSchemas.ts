import Joi from 'joi';
import {
  BOOK_DIFFICULTY,
  BOOK_SECTION_TAGS,
  BOOK_STATUS,
  RESERVATION_STATUS
} from './constants';

export const getHomeBooksQuerySchema = Joi.object({}).unknown(false);

export const getCatalogBooksQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(12),
  author: Joi.alternatives(
    Joi.string().trim(),
    Joi.array().items(Joi.string().trim())
  ),
  status: Joi.alternatives(
    Joi.string().valid(...BOOK_STATUS),
    Joi.array().items(Joi.string().valid(...BOOK_STATUS))
  ),
  difficulty: Joi.alternatives(
    Joi.string().valid(...BOOK_DIFFICULTY),
    Joi.array().items(Joi.string().valid(...BOOK_DIFFICULTY))
  ),
  sortBy: Joi.string().valid('popularity', 'title').default('popularity'),
  sortOrder: Joi.string().valid('asc', 'desc'),
  section: Joi.string()
    .valid(...BOOK_SECTION_TAGS)
    .optional()
}).unknown(false);

export const getFiltersQuerySchema = Joi.object({
  section: Joi.string()
    .valid(...BOOK_SECTION_TAGS)
    .optional()
}).unknown(false);

export const getBookByIdParamsSchema = Joi.object({
  id: Joi.string().required()
}).unknown(false);

export const searchBooksQuerySchema = Joi.object({
  q: Joi.string().trim().min(2).required(),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string()
    .valid(...BOOK_STATUS)
    .optional()
}).unknown(false);

export const getCategoriesQuerySchema = Joi.object({}).unknown(false);

export const createReservationBodySchema = Joi.object({
  bookId: Joi.string().required(),
  fullName: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().trim().min(5).max(20).required(),
  subdivision: Joi.string().trim().min(1).max(100).required(),
  comment: Joi.string().trim().max(500).allow('', null).optional()
}).unknown(false);

export const createBookBodySchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  author: Joi.string().trim().min(1).max(200).required(),
  coverUrl: Joi.string().uri().required(),
  status: Joi.string()
    .valid(...BOOK_STATUS)
    .default('in_stock'),
  description: Joi.string().trim().max(2000).optional(),
  difficulty: Joi.string()
    .valid(...BOOK_DIFFICULTY)
    .optional(),
  popularityScore: Joi.number().integer().min(0).optional(),
  sectionTags: Joi.array()
    .items(Joi.string().valid(...BOOK_SECTION_TAGS))
    .optional()
}).unknown(false);

export const getReservationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid(...RESERVATION_STATUS)
    .optional()
}).unknown(false);

export const getReservationByIdParamsSchema = Joi.object({
  id: Joi.string().required()
}).unknown(false);

export const updateReservationStatusBodySchema = Joi.object({
  status: Joi.string()
    .valid(...RESERVATION_STATUS)
    .required()
}).unknown(false);
