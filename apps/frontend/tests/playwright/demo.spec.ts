import { test, expect, type Page } from '@playwright/test'

const resetEndpoint = process.env.PLAYWRIGHT_RESET_URL ?? 'http://127.0.0.1:3000/testing/reset'

const gotoBoard = async (page: Page) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /four-lane kanban/i })).toBeVisible()
}

test.beforeEach(async ({ request }) => {
  const response = await request.post(resetEndpoint)
  expect(response.ok()).toBeTruthy()
})

test('user can add a task and move it across lanes', async ({ page }) => {
  await gotoBoard(page)

  await page.getByRole('button', { name: /new task/i }).click()
  const taskTitle = `Playwright Demo ${Date.now().toString(36)}`
  await page.getByLabel('Title').fill(taskTitle)
  await page.getByLabel('Description').fill('Created automatically via Playwright demo test')
  await page.getByRole('button', { name: /save task/i }).click()

  const taskCard = page.getByRole('article', { name: new RegExp(`${taskTitle} card`, 'i') })
  await expect(taskCard).toBeVisible()

  await taskCard.getByRole('button', { name: /move to in progress/i }).click()

  const inProgressLane = page.getByRole('region', { name: /in progress lane/i })
  await expect(inProgressLane).toContainText(taskTitle)
})
