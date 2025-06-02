type Category = {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  color?: string; // ✅ make it optional
  subcategories: Category[];
};
