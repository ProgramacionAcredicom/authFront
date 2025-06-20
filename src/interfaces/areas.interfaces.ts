export interface AreasPaginationType {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
}

export interface Result {
  id: number;
  code: string;
  name: string;
  chif: Chif;
  state: boolean;
}

export interface Chif {
  id: number;
  name: string;
  email: string;
}
