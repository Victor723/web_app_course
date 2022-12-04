import { test, expect } from '@playwright/test'

async function logIn(page, username, password) {
    // username is optional
    const usernameInput = await page.waitForSelector('input[name="username"]')
    if (usernameInput) {
        await page.fill('input[name="username"]', 'jd')
    }
    await page.fill('input[name="password"]', 'jd')
    await page.click('#kc-login')
}

test('Log in as jd, then log out', async ({ page }) => {
  await page.goto('http://localhost:8080/')
  await page.click('text=Login/Signup')
  await logIn(page, 'jd', 'jd')

  await page.waitForSelector('text=Welcome, John Doe')
  await page.click('text=Logout')
  await page.waitForSelector('text=Login/Signup')
})

test('Create and delete list', async ({ page }) => {
  await page.goto('http://localhost:8080/')
  await page.click('text=Login/Signup')
  await logIn(page, 'jd', 'jd')

  // Create list
  await page.waitForSelector('text=Welcome, John Doe')
  await page.click('#list-add')
  await page.focus('#list-add')
  await page.type('#list-add', 'my new list')
  await page.keyboard.press('Enter')

  // List should be created
  await page.waitForSelector('text=my new list')

  // Delete list
  await page.click('text=my new list')
  // Select an element that contains an element with the list name
  await page.click('text=my new list >> text=my new list')
  const element = await page.waitForSelector('text=my new list')
  // Selete the next sibling of element
  const deleteButton = await element.nextSibling()
  const nextSibling = await element.$eval('+ *', (el) => el)
  const [x, y] = await nextSibling.boundingBox()
  await page.click('', { x, y })
})

// This is a reference. From assignment 5
test('Add single item in customer page should reflect on operator page', async ({ page }) => {
  // Get possibleIngredients
  await page.goto('http://localhost:8096/api/possible-ingredients')
  const possibleIngredients = await page.evaluate(() => {
    return JSON.parse(document.body.textContent || '')
  })

  // Select a random ingredient
  const ingredient = possibleIngredients[Math.floor(Math.random() * possibleIngredients.length)].name
  console.log('Selected ingredient:', ingredient)

  await page.goto('http://localhost:8096/customer/alice')
  await expect(page).toHaveTitle(/UI/)

  await page.getByRole('button', { name: ingredient }).click()
  await page.click("text='Save'")
  await page.click("text='Submit'")

  await page.goto('http://localhost:8096/operator/jim')
  await expect(page).toHaveTitle(/UI/)

  await expect(page.locator('tbody tr:last-child td:last-child')).toHaveText(ingredient)
});
