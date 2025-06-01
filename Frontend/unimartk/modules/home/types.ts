type Category = {
  id: string;
  name: string;
  slug: string;
  color?: string; // ✅ make it optional
  subcategories: Category[];
};
