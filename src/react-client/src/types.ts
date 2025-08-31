export interface Supermarket {
  id: string;
  name: string;
  categories: Category[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  supermarketId: string;
  categoryId: string;
  isFrequent: boolean;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  supermarketId?: string; // Optional - can be set when shopping
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  productName: string; // Store product name for cross-store compatibility
  quantity: number;
  completed: boolean;
  notes?: string;
}