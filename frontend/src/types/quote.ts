export interface Quote {
  id: string;
  text: string;
  author: string;
  reflection: string;
  category: string;
  tags: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteListResponse {
  data: Quote[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
