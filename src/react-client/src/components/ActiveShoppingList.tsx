import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, ArrowLeft, Store, MapPin } from 'lucide-react';
import { ShoppingList, Product, Supermarket } from '../types';

interface ActiveShoppingListProps {
  shoppingList: ShoppingList;
  products: Product[];
  supermarkets: Supermarket[];
  onFinish: () => void;
  onUpdate: (list: ShoppingList) => void;
}

export function ActiveShoppingList({ 
  shoppingList, 
  products, 
  supermarkets, 
  onFinish, 
  onUpdate 
}: ActiveShoppingListProps) {
  const [selectedStoreId, setSelectedStoreId] = useState(shoppingList.supermarketId || '');
  
  const selectedStore = supermarkets.find(s => s.id === selectedStoreId);
  
  const handleStoreSelection = (storeId: string) => {
    setSelectedStoreId(storeId);
    const updatedList = {
      ...shoppingList,
      supermarketId: storeId,
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedList);
  };

  const sortedItems = useMemo(() => {
    if (!selectedStore) {
      // No store selected - show items in original order
      return shoppingList.items;
    }

    // Sort items by the selected store's category order
    return [...shoppingList.items].sort((a, b) => {
      const productA = products.find(p => p.id === a.productId);
      const productB = products.find(p => p.id === b.productId);
      
      // If products don't exist in the selected store, put them at the end
      if (!productA || productA.supermarketId !== selectedStoreId) return 1;
      if (!productB || productB.supermarketId !== selectedStoreId) return -1;
      
      const categoryA = selectedStore.categories.find(c => c.id === productA.categoryId);
      const categoryB = selectedStore.categories.find(c => c.id === productB.categoryId);
      
      if (!categoryA) return 1;
      if (!categoryB) return -1;
      
      return categoryA.order - categoryB.order;
    });
  }, [shoppingList.items, products, selectedStore, selectedStoreId]);

  const groupedItems = useMemo(() => {
    if (!selectedStore) {
      // No store selected - group by original store
      const grouped: Record<string, typeof sortedItems> = {};
      
      sortedItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const supermarket = product ? supermarkets.find(s => s.id === product.supermarketId) : null;
        const category = product && supermarket ? supermarket.categories.find(c => c.id === product.categoryId) : null;
        
        const key = category ? category.id : 'unknown';
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      });
      
      return grouped;
    }

    // Store selected - group by selected store's categories
    const grouped: Record<string, typeof sortedItems> = {};
    
    selectedStore.categories
      .sort((a, b) => a.order - b.order)
      .forEach(category => {
        const categoryItems = sortedItems.filter(item => {
          const product = products.find(p => p.id === item.productId);
          return product?.categoryId === category.id && product?.supermarketId === selectedStoreId;
        });
        
        if (categoryItems.length > 0) {
          grouped[category.id] = categoryItems;
        }
      });

    // Add items that don't match the selected store
    const unmatchedItems = sortedItems.filter(item => {
      const product = products.find(p => p.id === item.productId);
      return !product || product.supermarketId !== selectedStoreId;
    });

    if (unmatchedItems.length > 0) {
      grouped['unmatched'] = unmatchedItems;
    }
    
    return grouped;
  }, [sortedItems, selectedStore, products, supermarkets, selectedStoreId]);

  const toggleItemCompleted = (itemId: string) => {
    const updatedList = {
      ...shoppingList,
      items: shoppingList.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdate(updatedList);
  };

  const completedCount = shoppingList.items.filter(item => item.completed).length;
  const totalCount = shoppingList.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onFinish}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">{shoppingList.name}</h1>
          <p className="text-sm text-gray-600">
            {selectedStore ? selectedStore.name : 'Select store to sort items'}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Store Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Which store are you shopping at?</h3>
        </div>
        
        <select
          value={selectedStoreId}
          onChange={(e) => handleStoreSelection(e.target.value)}
          className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select a store to sort items by aisle order</option>
          {supermarkets.map(supermarket => (
            <option key={supermarket.id} value={supermarket.id}>
              {supermarket.name}
            </option>
          ))}
        </select>

        {selectedStore && (
          <div className="text-sm text-blue-700">
            ✓ Items will be sorted by {selectedStore.name}'s aisle layout
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Progress</span>
          <span className="text-sm text-gray-700">{completedCount}/{totalCount}</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Shopping Items */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([categoryId, items]) => {
          let category;
          let categoryName;
          let categoryColor;

          if (categoryId === 'unmatched') {
            categoryName = 'Items from other stores';
            categoryColor = 'bg-gray-500';
          } else if (selectedStore) {
            category = selectedStore.categories.find(c => c.id === categoryId);
            categoryName = category?.name || 'Unknown Category';
            categoryColor = category?.color || 'bg-gray-500';
          } else {
            // Find category from original store
            const firstItem = items[0];
            const product = products.find(p => p.id === firstItem.productId);
            const originalStore = product ? supermarkets.find(s => s.id === product.supermarketId) : null;
            category = product && originalStore ? originalStore.categories.find(c => c.id === product.categoryId) : null;
            categoryName = category?.name || 'Unknown Category';
            categoryColor = category?.color || 'bg-gray-500';
          }

          const categoryCompleted = items.filter(item => item.completed).length;
          const categoryTotal = items.length;
          const categoryProgress = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0;

          return (
            <div key={categoryId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${categoryColor}`} />
                  <h3 className="font-semibold text-gray-900">{categoryName}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {categoryCompleted}/{categoryTotal}
                </div>
              </div>

              <div className="bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    categoryProgress === 100 ? 'bg-green-500' : categoryColor.replace('bg-', 'bg-')
                  }`}
                  style={{ width: `${categoryProgress}%` }}
                />
              </div>

              <div className="space-y-1">
                {items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItemCompleted(item.id)}
                    className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                      item.completed
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-white border border-gray-200 hover:border-gray-300 active:scale-95'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <span className={`font-medium ${
                        item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {item.productName}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-2">×{item.quantity}</span>
                      )}
                      {categoryId === 'unmatched' && (
                        <div className="text-xs text-orange-600 mt-1">
                          Not available at {selectedStore?.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-900">Shopping Complete!</h3>
            <p className="text-green-700">All items have been checked off</p>
          </div>
          <button
            onClick={onFinish}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Finish Shopping
          </button>
        </div>
      )}
    </div>
  );
}