import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Settings, CheckCircle2, Circle, Store, ArrowLeft, GripVertical } from 'lucide-react';
import { SupermarketManager } from './components/SupermarketManager';
import { ProductManager } from './components/ProductManager';
import { ShoppingListManager } from './components/ShoppingListManager';
import { ActiveShoppingList } from './components/ActiveShoppingList';
import { Supermarket, Product, ShoppingList, ShoppingListItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSampleData } from './hooks/useSampleData';

function App() {
  const [supermarkets, setSupermarkets] = useLocalStorage<Supermarket[]>('supermarkets', []);
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [currentView, setCurrentView] = useState<'home' | 'supermarkets' | 'products' | 'lists' | 'shopping'>('home');
  const [selectedSupermarket, setSelectedSupermarket] = useState<string | null>(null);
  const [activeShoppingList, setActiveShoppingList] = useState<ShoppingList | null>(null);

  // Load sample data on first visit
  useSampleData(supermarkets, setSupermarkets, products, setProducts);

  const handleStartShopping = (list: ShoppingList) => {
    setActiveShoppingList(list);
    setCurrentView('shopping');
  };

  const handleFinishShopping = () => {
    setActiveShoppingList(null);
    setCurrentView('home');
  };

  const handleUpdateShoppingList = (updatedList: ShoppingList) => {
    setActiveShoppingList(updatedList);
    setShoppingLists(prev => 
      prev.map(list => list.id === updatedList.id ? updatedList : list)
    );
  };
  const renderContent = () => {
    switch (currentView) {
      case 'supermarkets':
        return (
          <SupermarketManager
            supermarkets={supermarkets}
            setSupermarkets={setSupermarkets}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'products':
        return (
          <ProductManager
            products={products}
            setProducts={setProducts}
            supermarkets={supermarkets}
            selectedSupermarket={selectedSupermarket}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'lists':
        return (
          <ShoppingListManager
            shoppingLists={shoppingLists}
            setShoppingLists={setShoppingLists}
            products={products}
            supermarkets={supermarkets}
            onStartShopping={handleStartShopping}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'shopping':
        return activeShoppingList ? (
          <ActiveShoppingList
            shoppingList={activeShoppingList}
            products={products}
            supermarkets={supermarkets}
            onFinish={handleFinishShopping}
            onUpdate={handleUpdateShoppingList}
          />
        ) : null;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Smart Shopping</h1>
              <p className="text-gray-600">Organize your shopping by store layout</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setCurrentView('lists')}
                className="bg-blue-600 text-white p-6 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="font-semibold">Shopping Lists</span>
                </div>
                <div className="bg-blue-500 rounded-full px-3 py-1 text-sm">
                  {shoppingLists.length}
                </div>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView('supermarkets')}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-95 transition-transform text-center space-y-2"
                >
                  <Store className="w-8 h-8 mx-auto text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Stores</div>
                    <div className="text-sm text-gray-500">{supermarkets.length} stores</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-95 transition-transform text-center space-y-2"
                >
                  <Settings className="w-4 h-4 mx-auto text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Products</div>
                    <div className="text-sm text-gray-500">{products.length} items</div>
                  </div>
                </button>
              </div>
            </div>

            {shoppingLists.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Recent Lists</h2>
                <div className="space-y-2">
                  {shoppingLists.slice(0, 3).map(list => {
                    const completedItems = list.items.filter(item => item.completed).length;
                    const totalItems = list.items.length;
                    const supermarket = list.supermarketId ? supermarkets.find(s => s.id === list.supermarketId) : null;
                    
                    return (
                      <div
                        key={list.id}
                        onClick={() => handleStartShopping(list)}
                        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-95 transition-transform cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{list.name}</div>
                            <div className="text-sm text-gray-500">
                              {supermarket?.name || 'No store selected'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {completedItems}/{totalItems}
                            </div>
                            <div className="text-xs text-gray-500">items</div>
                          </div>
                        </div>
                        {totalItems > 0 && (
                          <div className="mt-3 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(completedItems / totalItems) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {supermarkets.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <Store className="w-16 h-16 mx-auto text-gray-400" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Welcome!</h3>
                  <p className="text-gray-600">Start by adding your local supermarkets</p>
                </div>
                <button
                  onClick={() => setCurrentView('supermarkets')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Your First Store
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <div className="p-4 pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;