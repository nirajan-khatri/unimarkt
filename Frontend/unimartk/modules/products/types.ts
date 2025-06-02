type Role = {
  id: number;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  contact_number?: string;
  role: Role;
};

type Product = {
  id: string;
  name: string;
  category: Category;
  subCategory: Category;
  description: string;
  price: string;
  images?: string[];
  user?: User;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};
