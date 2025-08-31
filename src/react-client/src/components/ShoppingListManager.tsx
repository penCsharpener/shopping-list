import React, { useState } from 'react';
import { ArrowLeft, Plus, ShoppingCart, Check, Play, Trash2, Store } from 'lucide-react';
import { ShoppingList, Product, Supermarket } from '../types';

interface ShoppingListManagerProps {
  shoppingLists: ShoppingList[];
  setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>;
  products: Product[];
  supermarkets: Supermarket[];
  onStartShopping: (list: ShoppingList) => void;
  onBack: () => void;
}

export function ShoppingListManager({ 
  shoppingLists, 
  setShoppingLists, 
  products, 
  supermarkets, 
  onStartShopping, 
  onBack 
}: ShoppingListManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateList = () => {
    if (!newListName.trim() || selectedProducts.size === 0) return;

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      items: Array.from(selectedProducts).map(productId => {
        const product = products.find(p => p.id === productId);
        return {
          id: Date.now().toString() + Math.random(),
          productId,
          productName: product?.name || 'Unknown Product',
          quantity: 1,
          completed: false,
        };
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setShoppingLists(prev => [...prev, newList]);
    resetForm();
  };

  const resetForm = () => {
    setNewListName('');
    setSelectedProducts(new Set());
    setSearchTerm('');
    setShowCreateForm(false);
  };

  const handleDeleteList = (id: string) => {
    setShoppingLists(prev => prev.filter(l => l.id !== id));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const frequentProducts = products.filter(p => p.isFrequent);

  const addFrequentItems = () => {
    const frequentIds = new Set(frequentProducts.map(p => p.id));
    setSelectedProducts(prev => new Set([...prev, ...frequentIds]));
  };

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const supermarket = supermarkets.find(s => s.id === product.supermarketId);
    const category = supermarket?.categories.find(c => c.id === product.categoryId);
    
    if (!supermarket || !category) return acc;
    
    const key = `${supermarket.name} - ${category.name}`;
    if (!acc[key]) {
      acc[key] = {
        supermarket,
        category,
        products: []
      };
    }
    acc[key].products.push(product);
    return acc;
  }, {} as Record<string, { supermarket: Supermarket; category: any; products: Product[] }>);

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={resetForm}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create Shopping List</h1>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="List name (e.g., Weekly Groceries)"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />

          {frequentProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-yellow-900">Frequent Items</h3>
                <button
                  onClick={addFrequentItems}
                  className="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
                >
                  Add All ({frequentProducts.length})
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {frequentProducts.slice(0, 8).map(product => (
                  <span key={product.id} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                    {product.name}
                  </span>
                ))}
                {frequentProducts.length > 8 && (
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                    +{frequentProducts.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Select Products</h3>
              <span className="text-sm text-gray-500">
                {selectedProducts.size} selected
              </span>
            </div>

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="max-h-96 overflow-y-auto space-y-3">
              {Object.entries(groupedProducts).map(([groupKey, group]) => (
                <div key={groupKey} className="space-y-2">
                  <div className="flex items-center space-x-2 sticky top-0 bg-gray-50 py-2 -mx-2 px-2 rounded">
                    <div className={`w-3 h-3 rounded-full ${group.category.color}`} />
                    <span className="text-sm font-medium text-gray-700">{groupKey}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {group.products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => toggleProductSelection(product.id)}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedProducts.has(product.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedProducts.has(product.id)
                                ? 'border-blue-500 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedProducts.has(product.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{product.name}</span>
                          </div>
                          {product.isFrequent && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                              Frequent
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCreateList}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newListName.trim() || selectedProducts.size === 0}
            >
              Create List
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Shopping Lists</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={products.length === 0}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        {shoppingLists.map(list => {
          const completedItems = list.items.filter(item => item.completed).length;
          const totalItems = list.items.length;
          const isCompleted = completedItems === totalItems && totalItems > 0;
          const assignedStore = list.supermarketId ? supermarkets.find(s => s.id === list.supermarketId) : null;

          return (
            <div
              key={list.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{list.name}</div>
                  <div className="text-sm text-gray-500">
                    {assignedStore ? assignedStore.name : 'No store selected'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Complete
                    </div>
                  ) : (
                    <button
                      onClick={() => onStartShopping(list)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <Play className="w-4 h-4" />
                      <span>Shop</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600">
                  {completedItems} of {totalItems} items
                </span>
                <span className="text-gray-500">
                  {new Date(list.createdAt).toLocaleDateString()}
                </span>
              </div>

              {totalItems > 0 && (
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(completedItems / totalItems) * 100}%` }}
                  />
                </div>
              )}

              {!assignedStore && (
                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Store className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">
                      Select a store when shopping to sort items by aisle order
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {shoppingLists.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No shopping lists yet</h3>
            <p className="text-gray-600">Create your first shopping list with products from any store</p>
          </div>
          {products.length === 0 && (
            <p className="text-sm text-orange-600">Add some products first</p>
          )}
        </div>
      )}
    </div>
  );
}