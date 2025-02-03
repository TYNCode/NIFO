import { test, expect } from '@playwright/test';

test('Login and visit Dashboard', async ({ page }) => {
  // Navigate to the login page
  await page.goto('http://localhost:3000/login'); // Replace with actual URL

  // Fill the login form
  await page.fill('input#email', 'rakeshmahendran99@gmail.com'); // Replace with valid test credentials
  await page.fill('input#password', 'password'); // Replace with valid test credentials

  // Click the Sign In button
  await page.click('button[type="submit"]');

  // Wait for the homepage/dashboard to load
  await page.waitForURL('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 }); // Replace with the actual dashboard URL
  await expect(page).toHaveTitle(/The Yellow Network/i);

  const userName = page.locator('div.px-8.py-3.shadow-md'); 
  await expect(userName).toBeVisible();
  await userName.click();



  // **Click on the first name to toggle the dropdown**

  // **Verify that the dropdown appears with View Dashboard & Logout options**
  // await expect(page.getByText("View Dashboard")).toBeVisible();
  // await page.getByText('Details').click();
  // await expect(page.getByText("Logout")).toBeVisible();

  // **Click on "View Dashboard"**
  await page.getByText("View Dashboard").click();

  // **Ensure redirection to /Dashboard**
  await page.waitForURL('http://localhost:3000/Dashboard',  { waitUntil: 'networkidle', timeout: 5000 }); // Replace with actual Dashboard URL
  await page.locator('text="Startup Name"').waitFor({ state: 'visible', timeout: 15000 });



  var usersButton = page.locator('#EnterpriseManage'); 
  await usersButton.click();
  await expect(page.getByText("Manage EnterPrise Users")).toBeVisible();

  usersButton = page.locator('#ConsultantManage'); 
  await usersButton.click();
  await expect(page.getByText("Manage Consultant Users")).toBeVisible();

  


});
