export interface RequestInfinityScroll<
  T extends number | string | Date = number,
> {
  cursor: T | undefined;
  take: number | undefined;
}

export interface RequestPagination {
  take: number | undefined | null;
  page: number | undefined | null;
}
