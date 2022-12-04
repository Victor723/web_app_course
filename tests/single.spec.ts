import { test, expect } from '@playwright/test'

const uri = 'http://localhost:8080/'

async function logIn(page) {
    // username is optional
    const usernameInput = await page.waitForSelector('input[name="username"]')
    if (usernameInput) {
        await page.fill('input[name="username"]', 'jd')
    }
    await page.fill('input[name="password"]', 'jd')
    await page.click('#kc-login')
}

// Create a random name that starts with a letter
function randName(length) {
  // Generate a random number between 65 and 90, which are the ASCII codes for the letters A-Z
  const randomNumber = Math.floor(Math.random() * (90 - 65 + 1)) + 65;

  // Convert the random number to a letter using the ASCII code
  const randomLetter = String.fromCharCode(randomNumber);

  // Generate a random string of numbers with the specified length
  const randomString = Math.random().toString(36).slice(2, 2 + length - 1);

  // Return the random string starting with the random letter and ending with the random string of numbers
  return randomLetter + randomString;
}

test('Log in as jd, then log out', async ({ page }) => {
  await page.goto(uri)
  await page.click('text=Login/Signup')
  await logIn(page)

  await page.waitForSelector('text=Welcome, John Doe')
  await page.click('text=Logout')
  await page.waitForSelector('text=Login/Signup')
})

test('Create and delete list', async ({ page }) => {
  await page.goto(uri)
  await page.click('text=Login/Signup')
  await logIn(page)

  // Create list
  // Generate random list name
  const listName = randName(8)
  console.log('List name: ' + listName)
  await page.waitForSelector('text=Welcome, John Doe')
  await page.click('#list-add')
  await page.fill('#list-add > :only-child', listName)
  await page.keyboard.press('Enter')

  // List should be created
  await expect(page.locator('#' + listName)).toHaveText(' ' + listName)

  // Delete list
  await page.click('#' + listName + '_d')
  await page.click('#' + listName + '_t')
  
  // Wait for 1 sec, List should be deleted
  await expect(page.locator('#' + listName)).toBeNull()
})

test('Create and delete task', async ({ page }) => {
  await page.goto(uri)
  await page.click('text=Login/Signup')
  await logIn(page)

  // Create list
  // Generate random list name
  const listName = randName(8)
  console.log('List name 2: ' + listName)
  await page.waitForSelector('text=Welcome, John Doe')
  await page.click('#list-add')
  await page.fill('#list-add > :only-child', listName)
  await page.keyboard.press('Enter')

  // Bring up the task interface
  await expect(page.locator('#' + listName)).toHaveText(' ' + listName)
  await page.click('#' + listName)

  // Create task
  const taskName = randName(12)
  const taskDescription = 'TestDescription. This is a test task.'
  const taskTags = ['T1', 'T2']
  await page.click('#task-add')
  await page.fill('#task-name', taskName)
  await page.fill('#task-desc', taskDescription)

  // Add tags
  for (const tag of taskTags) {
    await page.click('#tags-basic')
    // Use keyboard to input tags
    await page.keyboard.type(tag)
    await page.keyboard.press('Enter')
  }

  // Select the second option in the dropdown, "Medium"
  await page.selectOption('#task-pri', { index: 1 })

  // Click on the date picker, press left arrow 2 times, then press enter
  await page.click('#task-start')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('Enter')

  // Click on the date picker, press down arrow 1 time, then press enter
  await page.click('#task-end')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  
  await page.selectOption('#task-pin', { index: 0 })

  // Submit the task
  await page.click('#task-save')

  // Task should be created
  await expect(page.locator('#' + taskName + '_task')).toHaveText(taskName)
  
  // Delete task
  await page.click('#' + taskName + '_taskck')

  // Wait for 1 sec, Task should be deleted
  expect(page.locator('#' + taskName + '_task')).toBeNull()

  // Delete list
  await page.click('#' + listName + '_d')
  await page.click('#' + listName + '_t')

  // Wait for 1 sec, List should be deleted
  expect(page.locator('#' + listName)).toBeNull()
})
