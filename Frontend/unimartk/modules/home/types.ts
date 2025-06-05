export interface Category {
  category_id: number;
  name: string;
}

export interface Subcategory {
  sub_category_id: number;
  name: string;
}

export interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  onCategorySelect: (category: string) => void;
  onSubcategorySelect: (subcategory: string) => void;
}