interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

export async function fetchFilteredServices(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  serviceFilters?: ServiceFilters
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const url = new URL(`${baseUrl}/skills/`);

  // Add pagination
  url.searchParams.append("page", page.toString());

  // Add search term - search in description
  if (searchTerm) {
    url.searchParams.append("description", searchTerm);
    // Also search in module name
    url.searchParams.append("module", searchTerm);
  }

  // Add category filters
  if (category) {
    url.searchParams.append("skill_category__name", category);
  } else if (subcategory) {
    url.searchParams.append("sub_category__name", subcategory);
  }

  // Add price filters
  if (serviceFilters?.minPrice) {
    url.searchParams.append("price_min", serviceFilters.minPrice);
  }
  if (serviceFilters?.maxPrice) {
    url.searchParams.append("price_max", serviceFilters.maxPrice);
  }

  // Add module filter from service filters (this is different from search)
  if (serviceFilters?.module) {
    url.searchParams.append("module", serviceFilters.module);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}