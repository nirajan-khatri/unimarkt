export type Category = {
  id: string;
  name: string;
  slug: string;
  color?: string;
  category_id: string | null;
  subcategories: Category[];
};

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
