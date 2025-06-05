import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace spaces and special chars with "-"
    .replace(/(^-|-$)+/g, ""); // remove starting/ending "-"
}

function getRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`; // pastel-like HSL color
}

// export function normalizeCategories(categories: Category[]): OldCategory[] {
//   return categories.map((cat) => ({
//     category_id: cat.category_id,
//     name: cat.name,
//     slug: generateSlug(cat.name),
//     color: getRandomPastelColor(),
//     subcategories: cat.subcategories.map((sub) => ({
//       category_id: sub.sub_category_id,
//       name: sub.name,
//       slug: generateSlug(sub.name),
//       color: null,
//       subcategories: [],
//     })),
//   }));
// }

export function normalizeCategories(categories: Category[]): OldCategory[] {
  const normalized = categories.map((cat) => ({
    category_id: cat.category_id,
    name: cat.name,
    slug: generateSlug(cat.name),
    color: getRandomPastelColor(),
    subcategories: cat.subcategories.map((sub) => ({
      category_id: sub.sub_category_id,
      name: sub.name,
      slug: generateSlug(sub.name),
      color: null,
      subcategories: [],
    })),
  }));

  const allCategory: OldCategory = {
    category_id: "0",
    name: "All",
    slug: "all",
    color: null,
    subcategories: [],
  };

  return [allCategory, ...normalized];
}
