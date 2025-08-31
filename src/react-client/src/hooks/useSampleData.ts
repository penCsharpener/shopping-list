import { useEffect } from 'react';
import { Supermarket, Product } from '../types';
import { sampleSupermarkets, sampleProducts } from '../utils/sampleData';

export function useSampleData(
  supermarkets: Supermarket[],
  setSupermarkets: React.Dispatch<React.SetStateAction<Supermarket[]>>,
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
  useEffect(() => {
    // Only add sample data if there's no existing data
    if (supermarkets.length === 0) {
      setSupermarkets(sampleSupermarkets);
    }
    
    if (products.length === 0) {
      setProducts(sampleProducts);
    }
  }, []);
}