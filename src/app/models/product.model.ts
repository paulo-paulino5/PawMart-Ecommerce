export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  inStock: boolean;
  rating: number;
}

export enum ProductCategory {
  DOG = 'dog',
  CAT = 'cat',
  SMALL_PETS = 'small-pets',
  FISH = 'fish',
  REPTILE = 'reptile'
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}