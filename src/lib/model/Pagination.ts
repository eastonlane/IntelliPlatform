export interface PaginationDto<TEntity> {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number,
    items: TEntity[],
}

export interface SearchPaginationDto<TEntity> extends PaginationDto<TEntity> {
    searchTerm: string | null;
}
