describe('index page', () => {
  beforeAll(async () => {
    jest.setTimeout(50000)
    await page.goto('http://127.0.0.1:4000')
  })

  it('should display top page text', async () => {
    await expect(page).toMatch('追加')
  })
})
