export type Category = {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
};

// If the API returns an array of products, you would use:
export type ProductList = Product[];
export interface ProductsResponse {
  data: Product[];
  total: number;
}