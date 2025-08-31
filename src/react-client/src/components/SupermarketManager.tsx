import React, { useState } from 'react';
import { ArrowLeft, Plus, Store, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Supermarket, Category } from '../types';

interface SupermarketManagerProps {
  supermarkets: Supermarket[];
  setSupermarkets: React.Dispatch<React.SetStateAction<Supermarket[]>>;
  onBack: () => void;
}

const DEFAULT_CATEGORIES = [
  { name: 'Produce', color: 'bg-green-500' },
  { name: 'Bakery', color: 'bg-yellow-500' },
  { name: 'Meat & Seafood', color: 'bg-red-500' },
  { name: 'Dairy', color: 'bg-blue-500' },
  { name: 'Frozen', color: 'bg-cyan-500' },
  { name: 'Pantry', color: 'bg-orange-500' },
  { name: 'Beverages', color: 'bg-purple-500' },
  { name: 'Health & Beauty', color: 'bg-pink-500' },
  { name: 'Household', color: 'bg-gray-500' },
];

export function SupermarketManager({ supermarkets, setSupermarkets, onBack }: SupermarketManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupermarket, setEditingSupermarket] = useState<Supermarket | null>(null);
  const [newSupermarketName, setNewSupermarketName] = useState('');
  const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);

  const handleAddSupermarket = () => {
    if (!newSupermarketName.trim()) return;

    const newSupermarket: Supermarket = {
      id: Date.now().toString(),
      name: newSupermarketName.trim(),
      categories: DEFAULT_CATEGORIES.map((cat, index) => ({
        id: Date.now().toString() + index,
        name: cat.name,
        color: cat.color,
        order: index,
      })),
      createdAt: new Date().toISOString(),
    };

    setSupermarkets(prev => [...prev, newSupermarket]);
    setNewSupermarketName('');
    setShowAddForm(false);
  };

  const handleDeleteSupermarket = (id: string) => {
    setSupermarkets(prev => prev.filter(s => s.id !== id));
    if (editingSupermarket?.id === id) {
      setEditingSupermarket(null);
    }
  };

  const handleReorderCategories = (supermarketId: string, sourceIndex: number, destinationIndex: number) => {
    setSupermarkets(prev => prev.map(supermarket => {
      if (supermarket.id !== supermarketId) return supermarket;

      const categories = [...supermarket.categories];
      const [removed] = categories.splice(sourceIndex, 1);
      categories.splice(destinationIndex, 0, removed);

      return {
        ...supermarket,
        categories: categories.map((cat, index) => ({ ...cat, order: index }))
      };
    }));
  };

  if (editingSupermarket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setEditingSupermarket(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Store Layout</h1>
          <div className="w-10" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-blue-900 mb-2">{editingSupermarket.name}</h2>
          <p className="text-sm text-blue-700">
            Drag categories to match the order you walk through the store
          </p>
        </div>

        <div className="space-y-2">
          {editingSupermarket.categories
            .sort((a, b) => a.order - b.order)
            .map((category, index) => (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-3 shadow-sm"
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div className={`w-4 h-4 rounded-full ${category.color}`} />
                <span className="flex-1 font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
            ))}
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
        <h1 className="text-xl font-bold text-gray-900">Supermarkets</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <input
            type="text"
            placeholder="Store name (e.g., Whole Foods, Safeway)"
            value={newSupermarketName}
            onChange={(e) => setNewSupermarketName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddSupermarket}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Store
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSupermarketName('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {supermarkets.map(supermarket => (
          <div
            key={supermarket.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-semibold text-gray-900">{supermarket.name}</div>
                  <div className="text-sm text-gray-500">
                    {supermarket.categories.length} categories
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingSupermarket(supermarket)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSupermarket(supermarket.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {supermarket.categories
                .sort((a, b) => a.order - b.order)
                .slice(0, 6)
                .map(category => (
                  <div
                    key={category.id}
                    className={`${category.color} text-white px-2 py-1 rounded text-xs font-medium`}
                  >
                    {category.name}
                  </div>
                ))}
              {supermarket.categories.length > 6 && (
                <div className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  +{supermarket.categories.length - 6}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {supermarkets.length === 0 && !showAddForm && (
        <div className="text-center py-12 space-y-4">
          <Store className="w-16 h-16 mx-auto text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No stores yet</h3>
            <p className="text-gray-600">Add your first supermarket to get started</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Store
          </button>
        </div>
      )}
    </div>
  );
}