import { AreasPaginationType, Result } from "@/interfaces/areas.interfaces";

export class AreaModel {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
  constructor(agencia: AreasPaginationType) {
    this.page = agencia.page;
    this.page_size = agencia.page_size;
    this.total = agencia.total;
    this.results = agencia.results;
    this.total_pages = agencia.total_pages;
  }
}
