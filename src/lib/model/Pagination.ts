export interface PaginationDto<TEntity> {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number,
    items: TEntity[],
}