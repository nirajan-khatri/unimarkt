export async function fetchFilteredProducts(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string
) {
  let url;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  url = new URL(`${baseUrl}/products/`);

  if (category) {
    url.searchParams.append("category__name", category);
  } else if (subcategory) {
    url.searchParams.append("sub_category__name", subcategory);
  }

  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", "10");
  if (searchTerm) url.searchParams.append("name", searchTerm);

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      "X-CSRFTOKEN": "E1QRLlXIS1RE4mx3QX9ECchSoKYaa58qiMmyPDtUbcutPpk3M4GxmqCOOyt47pV2",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}