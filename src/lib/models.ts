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

export interface MenuResponse {
  name: string;
  price: number;
  details: string | null;
  image: string | null;
  id: number;
}
export interface Menu {
  name: string;
  price: number;
  details: string | null;
  image: string | null;
  id: number;
}

export interface OrderItem {
  menu_id: number;
  amount: number;
  price: number;
  additional_info: string | null;
}

export interface OrderBase {
  first_name: string;
  last_name: string;
  phone: string;
  order_items: OrderItem[];
}

export interface FullOrderItem {
  menu_id: number;
  amount: number;
  price: number;
  additional_info: string | null;
  menu: Menu;
}

export interface OrderResponse {
  id: number;
  ordered_on: string;
  first_name: string;
  last_name: string;
  phone: string;
  order_items: FullOrderItem[];
}
