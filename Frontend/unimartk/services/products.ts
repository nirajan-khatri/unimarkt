interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
}

export async function fetchFilteredProducts(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  priceFilters?: PriceFilters
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const url = new URL(`${baseUrl}/products/`);

  // Add pagination
  url.searchParams.append("page", page.toString());

  // Add search term
  if (searchTerm) {
    url.searchParams.append("name", searchTerm);
  }

  // Add category filters
  if (category) {
    url.searchParams.append("category__name", category);
  } else if (subcategory) {
    url.searchParams.append("sub_category__name", subcategory);
  }

  // Add price filters
  if (priceFilters?.minPrice) {
    url.searchParams.append("price_min", priceFilters.minPrice);
  }
  if (priceFilters?.maxPrice) {
    url.searchParams.append("price_max", priceFilters.maxPrice);
  }

  // Add pickup location filter
  if (priceFilters?.pickupLocation) {
    url.searchParams.append("pickup_location", priceFilters.pickupLocation);
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}