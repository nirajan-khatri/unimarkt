export async function fetchCategories() {
  const res = await fetch("http://localhost:8000/api/categories/", {
    next: { revalidate: 60 }, // optional, for ISR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}
