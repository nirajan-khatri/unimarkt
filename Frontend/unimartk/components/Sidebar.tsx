'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

interface SidebarProps {
  onCategorySelect: (category: string) => void;
  onSubcategorySelect: (subcategory: string) => void;
}

export function Sidebar({ onCategorySelect, onSubcategorySelect, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const [currentParent, setCurrentParent] = React.useState<string | null>(null);
  const [parentStack, setParentStack] = React.useState<string[]>([]);
  
  const [menuData] = React.useState<MenuItem[]>([
    {
      id: 'electronics',
      label: 'Electronics',
      children: [
        { id: 'mobile-phones', label: 'Mobile Phones' }
      ]
    },
    {
      id: 'books',
      label: 'Books',
      children: [
        { id: 'fiction', label: 'Fiction' }
      ]
    },
    {
      id: 'clothing',
      label: 'Clothing',
      children: [
        { id: 'tshirts', label: 'Tshirts' }
      ]
    },
    {
      id: 'furniture',
      label: 'Furniture',
      children: []
    },
    {
      id: 'sports',
      label: 'Sports',
      children: []
    }
  ]);

  const currentItems = currentParent
    ? menuData.find(item => item.id === currentParent)?.children || []
    : menuData;

  const handleItemClick = (item: MenuItem) => {
    if (currentParent === null) {
      // Category selection
      onCategorySelect(item.label);
      if (item.children && item.children.length > 0) {
        setParentStack([...parentStack, 'root']);
        setCurrentParent(item.id);
      }
    } else {
      // Subcategory selection
      onSubcategorySelect(item.label);
    }
  };

  const handleBack = () => {
    const newStack = [...parentStack];
    const previousParent = newStack.pop();
    setCurrentParent(previousParent === 'root' ? null : previousParent || null);
    setParentStack(newStack);
    onCategorySelect(''); // Clear category filter when going back
  };

  return (
    <div className={`w-64 h-screen border-r bg-white dark:bg-gray-800 fixed z-10 ${!isSidebarOpen && "hidden"}`}>
      <div className="p-4">
        {/* Header with Back Button */}
        <div className="mb-4 flex items-center gap-2">
          {parentStack.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {currentItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleItemClick(item)}
            >
              {item.label}
              {item.children && item.children.length > 0 && (
                <span className="ml-auto">›</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}