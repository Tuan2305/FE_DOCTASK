export interface ResponsePaganation<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

export interface Metadata{
  pageIndex:number;
  totalPages: number;
  totalItems: number;
  currentItems: number;
  hasPrevious:boolean;
  hasNext: boolean;
}
