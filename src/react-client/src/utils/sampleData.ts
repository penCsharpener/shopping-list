import { Supermarket, Product } from '../types';

export const sampleSupermarkets: Supermarket[] = [
  {
    id: 'whole-foods',
    name: 'Whole Foods Market',
    categories: [
      { id: 'produce', name: 'Produce', color: 'bg-green-500', order: 0 },
      { id: 'bakery', name: 'Bakery', color: 'bg-yellow-500', order: 1 },
      { id: 'deli', name: 'Deli', color: 'bg-orange-500', order: 2 },
      { id: 'meat', name: 'Meat & Seafood', color: 'bg-red-500', order: 3 },
      { id: 'dairy', name: 'Dairy', color: 'bg-blue-500', order: 4 },
      { id: 'frozen', name: 'Frozen', color: 'bg-cyan-500', order: 5 },
      { id: 'pantry', name: 'Pantry', color: 'bg-amber-600', order: 6 },
      { id: 'beverages', name: 'Beverages', color: 'bg-purple-500', order: 7 },
      { id: 'health', name: 'Health & Beauty', color: 'bg-pink-500', order: 8 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'safeway',
    name: 'Safeway',
    categories: [
      { id: 'produce-sf', name: 'Produce', color: 'bg-green-500', order: 0 },
      { id: 'bakery-sf', name: 'Bakery', color: 'bg-yellow-500', order: 1 },
      { id: 'dairy-sf', name: 'Dairy', color: 'bg-blue-500', order: 2 },
      { id: 'meat-sf', name: 'Meat & Seafood', color: 'bg-red-500', order: 3 },
      { id: 'frozen-sf', name: 'Frozen', color: 'bg-cyan-500', order: 4 },
      { id: 'canned-sf', name: 'Canned Goods', color: 'bg-amber-600', order: 5 },
      { id: 'snacks-sf', name: 'Snacks', color: 'bg-orange-500', order: 6 },
      { id: 'beverages-sf', name: 'Beverages', color: 'bg-purple-500', order: 7 },
      { id: 'household-sf', name: 'Household', color: 'bg-gray-500', order: 8 },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const sampleProducts: Product[] = [
  // Whole Foods products
  { id: '1', name: 'Organic Bananas', supermarketId: 'whole-foods', categoryId: 'produce', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Avocados', supermarketId: 'whole-foods', categoryId: 'produce', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Fresh Bread', supermarketId: 'whole-foods', categoryId: 'bakery', isFrequent: false, createdAt: new Date().toISOString() },
  { id: '4', name: 'Organic Milk', supermarketId: 'whole-foods', categoryId: 'dairy', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Greek Yogurt', supermarketId: 'whole-foods', categoryId: 'dairy', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '6', name: 'Salmon Fillet', supermarketId: 'whole-foods', categoryId: 'meat', isFrequent: false, createdAt: new Date().toISOString() },
  { id: '7', name: 'Frozen Berries', supermarketId: 'whole-foods', categoryId: 'frozen', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '8', name: 'Quinoa', supermarketId: 'whole-foods', categoryId: 'pantry', isFrequent: false, createdAt: new Date().toISOString() },
  
  // Safeway products
  { id: '9', name: 'Bananas', supermarketId: 'safeway', categoryId: 'produce-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '10', name: 'Whole Milk', supermarketId: 'safeway', categoryId: 'dairy-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '11', name: 'Chicken Breast', supermarketId: 'safeway', categoryId: 'meat-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '12', name: 'Frozen Pizza', supermarketId: 'safeway', categoryId: 'frozen-sf', isFrequent: false, createdAt: new Date().toISOString() },
  { id: '13', name: 'Cereal', supermarketId: 'safeway', categoryId: 'canned-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '14', name: 'Orange Juice', supermarketId: 'safeway', categoryId: 'beverages-sf', isFrequent: true, createdAt: new Date().toISOString() },
  
  // Cross-store common products
  { id: '15', name: 'Eggs', supermarketId: 'whole-foods', categoryId: 'dairy', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '16', name: 'Eggs', supermarketId: 'safeway', categoryId: 'dairy-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '17', name: 'Bread', supermarketId: 'whole-foods', categoryId: 'bakery', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '18', name: 'Bread', supermarketId: 'safeway', categoryId: 'bakery-sf', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '19', name: 'Apples', supermarketId: 'whole-foods', categoryId: 'produce', isFrequent: true, createdAt: new Date().toISOString() },
  { id: '20', name: 'Apples', supermarketId: 'safeway', categoryId: 'produce-sf', isFrequent: true, createdAt: new Date().toISOString() },
];