export const BOOK_STATUS = ['in_stock', 'reserved', 'issued'] as const;
export type BookStatus = (typeof BOOK_STATUS)[number];

export const BOOK_DIFFICULTY = ['basic', 'medium', 'advanced'] as const;
export type BookDifficulty = (typeof BOOK_DIFFICULTY)[number];

export const BOOK_SECTION_TAGS = ['recommended', 'new', 'commander'] as const;
export type BookSectionTag = (typeof BOOK_SECTION_TAGS)[number];

export const RESERVATION_STATUS = [
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
  'returned'
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUS)[number];

export const ERROR_CODES = {
  INTERNAL_ERROR: 'internal_error',
  BOOK_NOT_FOUND: 'book_not_found',
  BOOK_NOT_RESERVABLE: 'book_not_reservable',
  VALIDATION_ERROR: 'validation_error',
  INVALID_QUERY: 'invalid_query',
  INVALID_PARAMS: 'invalid_params'
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
