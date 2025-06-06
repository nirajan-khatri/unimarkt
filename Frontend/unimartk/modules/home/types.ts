type Category = {
  category_id: string;
  name: string;
  slug: string;
  color?: string; // ✅ make it optional
  subcategories: SubCategory[];
};

type SubCategory = {
  sub_category_id: string;
  name: string;
  slug: string;
  category_id: string;
  color?: string;
};

type OldCategory = {
  id: string;
  name: string;
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
