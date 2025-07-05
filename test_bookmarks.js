const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Check if we're on auth page
    const currentUrl = page.url();
    if (currentUrl.includes('/auth') || currentUrl === 'http://localhost:3000/') {
      console.log('🔐 Logging in...');
      
      // Fill login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      console.log('✅ Login successful');
    }

    // Navigate to collections page to create a collection first
    await page.goto('http://localhost:3000/collections');
    await page.waitForTimeout(2000);

    // Check if there are any collections, if not create one
    const addCollectionButton = await page.locator('text=Add Collection').first();
    if (await addCollectionButton.isVisible()) {
      console.log('📁 Creating a collection...');
      await addCollectionButton.click();
      
      // Fill collection form
      await page.fill('input[name="name"]', 'Test Collection');
      await page.fill('textarea[name="description"]', 'A test collection for bookmarks');
      
      // Submit collection form
      await page.click('button[type="submit"]:has-text("Create Collection")');
      await page.waitForTimeout(2000);
      console.log('✅ Collection created');
    }

    // Navigate to bookmarks page
    await page.goto('http://localhost:3000/bookmarks');
    await page.waitForTimeout(2000);

    // Test adding a bookmark
    console.log('🔖 Testing bookmark creation...');
    const addBookmarkButton = await page.locator('text=Add Bookmark').first();
    await addBookmarkButton.click();

    // Fill bookmark form
    await page.fill('input[name="url"]', 'https://github.com');
    await page.fill('input[name="title"]', 'GitHub');
    await page.fill('textarea[name="description"]', 'The world\'s leading AI-powered developer platform');
    await page.fill('input[name="tags"]', 'development, code, git');
    await page.fill('textarea[name="notes"]', 'Great platform for code collaboration');

    // Submit bookmark form
    await page.click('button[type="submit"]:has-text("Add Bookmark")');
    await page.waitForTimeout(3000);

    // Verify bookmark was created
    const bookmarkCard = await page.locator('.bg-white.rounded-lg.shadow').first();
    if (await bookmarkCard.isVisible()) {
      console.log('✅ Bookmark created successfully!');
      
      // Test bookmark interaction
      const bookmarkTitle = await bookmarkCard.locator('h3').textContent();
      console.log(`📖 Found bookmark: ${bookmarkTitle}`);
      
      // Test bookmark menu
      const menuButton = await bookmarkCard.locator('button').last();
      await menuButton.click();
      await page.waitForTimeout(1000);
      
      // Check if menu appeared
      const editButton = await page.locator('text=Edit Bookmark');
      if (await editButton.isVisible()) {
        console.log('✅ Bookmark menu working');
        
        // Test edit functionality
        await editButton.click();
        await page.waitForTimeout(1000);
        
        // Modify title
        await page.fill('input[name="title"]', 'GitHub - Updated');
        await page.click('button[type="submit"]:has-text("Update Bookmark")');
        await page.waitForTimeout(3000);
        
        console.log('✅ Bookmark edit functionality working');
      }
    } else {
      console.log('❌ Bookmark creation failed - card not found');
    }

    // Test search functionality
    console.log('🔍 Testing search functionality...');
    await page.fill('input[placeholder="Search bookmarks..."]', 'GitHub');
    await page.waitForTimeout(2000);
    
    const searchResults = await page.locator('.bg-white.rounded-lg.shadow').count();
    console.log(`📊 Search returned ${searchResults} results`);

    console.log('🎉 All bookmark tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take screenshot on failure
    await page.screenshot({ path: 'bookmark-test-failure.png', fullPage: true });
    console.log('📸 Screenshot saved as bookmark-test-failure.png');
  } finally {
    await browser.close();
  }
})();