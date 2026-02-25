export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Build pagination metadata for list responses.
 */
export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  totalItems: number
): PaginationMeta => {
  const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 0;
  return { page, pageSize, totalItems, totalPages };
};
