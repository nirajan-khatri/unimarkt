interface ActiveFiltersProps {
  category?: string | null;
  subcategory?: string | null;
}

export function ActiveFilters({ category, subcategory }: ActiveFiltersProps) {
  if (!category && !subcategory) return null;

  return (
    <div className="mb-4 flex gap-2">
      {category && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Category: {category}
        </span>
      )}
      {subcategory && (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Subcategory: {subcategory}
        </span>
      )}
    </div>
  );
}