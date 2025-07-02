import { test, expect } from '@playwright/test';
import path from 'path';


test('homepage shows filter options', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');

  // Assert that the "Filters" heading is visible
  await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Pickup Location' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Price' })).toBeVisible();
});

test('test product search', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Search products' }).click();
  await page.getByRole('textbox', { name: 'Search products' }).fill('coffee');
  await page.getByRole('heading', { name: 'Coffee Table' }).click();
  await page.getByText('Coffee Tablee').click();
  await page.getByRole('heading', { name: 'Coffee Table' }).click();
  await page.getByRole('button', { name: 'Log in' }).nth(1).click();
  await page.getByText('Welcome back').click();
});






// Base URL
const baseURL = 'http://localhost:3000';

// Helper: login function used in Create Product tests
async function login(page) {
  await page.goto(baseURL);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('string');
  await page.getByRole('button', { name: 'Log In' }).click();
}


test('Create Product - Valid Input', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'string' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Create a new Listing' }).click();
  await page.getByRole('textbox', { name: 'Product Name *' }).click();
  await page.getByRole('textbox', { name: 'Product Name *' }).fill('testProduct2');
  await page.getByRole('combobox', { name: 'Category *', exact: true }).click();
  await page.getByRole('option', { name: 'Electronics' }).click();
  await page.getByRole('combobox', { name: 'Sub Category *' }).click();
  await page.getByRole('option', { name: 'Mobile Phones' }).click();
  await page.getByRole('textbox', { name: 'e.g., Noise-cancelling, 30-' }).click();
  await page.getByRole('textbox', { name: 'e.g., Noise-cancelling, 30-' }).fill('waterproof');
  await page.getByRole('button', { name: 'Generate with AI' }).click();
  await page.getByPlaceholder('0.00').click();
  await page.getByPlaceholder('0.00').fill('12');
  await page.getByRole('textbox', { name: 'Location (City) *' }).click();
  await page.getByRole('textbox', { name: 'Location (City) *' }).fill('frankfurt');
  const filePath = path.resolve(__dirname, 'Screenshot-test-product.png');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole('button', { name: 'Create Product' }).click();
  await expect(page.getByLabel('Products')).toContainText('Pending');
});

// 2. Create Product - Invalid Input (empty required fields)
test('Create Product - Invalid Input', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'string' }).click(); // open user menu
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Create a new Listing' }).click();

  // Submit empty form directly
  await page.getByRole('button', { name: 'Create Product' }).click();

  // Expect validation errors (example: check for error messages on required fields)
  await expect(page.locator('text=Name is required')).toBeVisible();
  await expect(page.locator('text=Please select a category')).toBeVisible();
  await expect(page.locator('text=Please select a sub category')).toBeVisible();
  await expect(page.locator('text=Location is required')).toBeVisible();
});

// 3. Search Product - Valid Term
test('Search Product - Valid Term', async ({ page }) => {
  await page.goto(baseURL);

  const searchBox = page.getByRole('textbox', { name: 'Search products' });
  await searchBox.fill('testProduct1');
  await searchBox.press('Enter');

  // Expect product with matching name in results
  await expect(page.getByRole('heading', { name: 'testProduct1' })).toBeVisible();
});

// 4. Search Product - No Results
test('Search Product - No Results', async ({ page }) => {
  await page.goto(baseURL);

  const searchBox = page.getByRole('textbox', { name: 'Search products' });
  await searchBox.fill('NonExistentProductXYZ');
  await searchBox.press('Enter');

  // Expect no results message visible
  await expect(page.locator('text=No products found')).toBeVisible();
});
