export interface Category {
  name: string;
  detail: string | null;
  id: number;
}

export interface SingleBook {
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  image: string | null;
  summary: string | null;
  details: string | null;
  categories: Category[];
}

export interface BookResponse {
  message: string;
  id: number;
}

export interface Book {
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  image: string | null;
  summary: string | null;
  details: string | null;
  categories: Category[];
  id: number;
}

export interface Menu {
  name: string;
  price: number;
  image: string | null;
  id: number;
}