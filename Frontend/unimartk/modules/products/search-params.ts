import {
  createLoader,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortValues = [
  "curated",
  "trending",
  "hot_and_new",
  "price_low_to_high",
  "price_high_to_low",
] as const;

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  cities: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault([]),
};

export const loadProductFilters = createLoader(params);
