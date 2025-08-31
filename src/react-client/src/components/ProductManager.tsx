import React, { useState } from 'react';
import { ArrowLeft, Plus, Package, Star, Edit2, Trash2 } from 'lucide-react';
import { Product, Supermarket } from '../types';

interface ProductManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  supermarkets: Supermarket[];
  selectedSupermarket: string | null;
  onBack: () => void;
}

export function ProductManager({ 
  products, 
  setProducts, 
  supermarkets, 
  selectedSupermarket, 
  onBack 
}: ProductManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStore, setSelectedStore] = useState(selectedSupermarket || '');
  const [newProductName, setNewProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFrequent, setIsFrequent] = useState(false);

  const currentSupermarket = supermarkets.find(s => s.id === selectedStore);
  const filteredProducts = selectedStore 
    ? products.filter(p => p.supermarketId === selectedStore)
    : products;

  const handleAddProduct = () => {
    if (!newProductName.trim() || !selectedStore || !selectedCategory) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: newProductName.trim(),
      supermarketId: selectedStore,
      categoryId: selectedCategory,
      isFrequent,
      createdAt: new Date().toISOString(),
    };

    setProducts(prev => [...prev, newProduct]);
    setNewProductName('');
    setSelectedCategory('');
    setIsFrequent(false);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleFrequent = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, isFrequent: !p.isFrequent } : p
    ));
  };

  const getProductsByCategory = () => {
    if (!currentSupermarket) return {};
    
    const grouped: Record<string, Product[]> = {};
    
    currentSupermarket.categories
      .sort((a, b) => a.order - b.order)
      .forEach(category => {
        grouped[category.id] = filteredProducts.filter(p => p.categoryId === category.id);
      });
    
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={supermarkets.length === 0}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {supermarkets.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <Store className="w-16 h-16 mx-auto text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No stores yet</h3>
            <p className="text-gray-600">Add a supermarket first to manage products</p>
          </div>
        </div>
      )}

      {supermarkets.length > 0 && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Store</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Stores</option>
              {supermarkets.map(supermarket => (
                <option key={supermarket.id} value={supermarket.id}>
                  {supermarket.name}
                </option>
              ))}
            </select>
          </div>

          {showAddForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Add New Product</h3>
              
              <div className="space-y-3">
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Store</option>
                  {supermarkets.map(supermarket => (
                    <option key={supermarket.id} value={supermarket.id}>
                      {supermarket.name}
                    </option>
                  ))}
                </select>

                {selectedStore && currentSupermarket && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {currentSupermarket.categories
                      .sort((a, b) => a.order - b.order)
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isFrequent}
                    onChange={(e) => setIsFrequent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Frequently bought item</span>
                </label>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  disabled={!newProductName.trim() || !selectedStore || !selectedCategory}
                >
                  Add Product
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProductName('');
                    setSelectedCategory('');
                    setIsFrequent(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {currentSupermarket && (
            <div className="space-y-4">
              {Object.entries(getProductsByCategory()).map(([categoryId, categoryProducts]) => {
                const category = currentSupermarket.categories.find(c => c.id === categoryId);
                if (!category || categoryProducts.length === 0) return null;

                return (
                  <div key={categoryId} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">({categoryProducts.length})</span>
                    </div>
                    
                    <div className="space-y-1">
                      {categoryProducts.map(product => (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{product.name}</span>
                            {product.isFrequent && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => toggleFrequent(product.id)}
                              className={`p-1.5 rounded transition-colors ${
                                product.isFrequent 
                                  ? 'text-yellow-600 hover:bg-yellow-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${product.isFrequent ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!currentSupermarket && filteredProducts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Package className="w-16 h-16 mx-auto text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">No products yet</h3>
                <p className="text-gray-600">Select a store and add your first product</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}