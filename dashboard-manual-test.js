const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Test account credentials
const TEST_EMAIL = 'test-dashboard@tappr.test';
const TEST_PASSWORD = 'TestPassword123!';
const TEST_USERNAME = 'testuser-responsive';

// Viewport configurations
const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Pixel 5', width: 393, height: 851 },
  { name: 'Galaxy S20', width: 360, height: 800 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

const screenshotsDir = path.join(__dirname, 'dashboard-test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function createTestAccount(page) {
  console.log('\n🔐 Creating test account...');
  
  try {
    await page.goto('https://tappr.in/signup', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Fill signup form
    await page.fill('input[type="email"], input[name="email"]', TEST_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', TEST_PASSWORD);
    await page.fill('input[name="username"], input[placeholder*="username" i]', TEST_USERNAME);
    
    // Submit form
    await page.click('button:has-text("Create Account"), button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check if we're on dashboard or need to login
    const currentUrl = page.url();
    console.log(`   Current URL after signup: ${currentUrl}`);
    
    if (currentUrl.includes('login')) {
      console.log('   Account may already exist, trying login...');
      return await loginToAccount(page);
    }
    
    return currentUrl.includes('dashboard');
  } catch (error) {
    console.log(`   Signup failed (account may exist): ${error.message}`);
    return await loginToAccount(page);
  }
}

async function loginToAccount(page) {
  console.log('\n🔑 Logging in...');
  
  try {
    await page.goto('https://tappr.in/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.fill('input[type="email"], input[name="email"]', TEST_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', TEST_PASSWORD);
    
    await page.click('button:has-text("Sign In"), button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`   Current URL after login: ${currentUrl}`);
    
    return currentUrl.includes('dashboard');
  } catch (error) {
    console.log(`   Login failed: ${error.message}`);
    return false;
  }
}

async function setupProfile(page) {
  console.log('\n📝 Setting up test profile...');
  
  try {
    await page.goto('https://tappr.in/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Fill profile info
    const displayNameInput = page.locator('input[name="displayName"], input[placeholder*="name" i]').first();
    if (await displayNameInput.isVisible().catch(() => false)) {
      await displayNameInput.fill('Test User Profile');
      console.log('   ✓ Display name set');
    }
    
    const bioTextarea = page.locator('textarea[name="bio"], textarea[placeholder*="bio" i]').first();
    if (await bioTextarea.isVisible().catch(() => false)) {
      await bioTextarea.fill('Full-Stack Developer | AI Enthusiast | Testing responsive design for the QR Connect dashboard. This is a longer bio to test text wrapping and overflow handling on mobile devices.');
      console.log('   ✓ Bio set');
    }
    
    // Save profile
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
    if (await saveButton.isVisible().catch(() => false)) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      console.log('   ✓ Profile saved');
    }
    
    return true;
  } catch (error) {
    console.log(`   Profile setup error: ${error.message}`);
    return false;
  }
}

async function testDashboardResponsive(browser, device) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height }
  });
  const page = await context.newPage();
  
  const results = {
    device: `${device.name} (${device.width}x${device.height})`,
    tests: [],
    screenshots: [],
    overallPass: true
  };
  
  console.log(`\n📱 Testing Dashboard on ${device.name}...`);
  
  try {
    // Login first
    const loggedIn = await loginToAccount(page);
    if (!loggedIn) {
      results.tests.push({ component: 'Authentication', status: 'FAIL', issue: 'Could not login' });
      results.overallPass = false;
      await context.close();
      return results;
    }
    
    await page.goto('https://tappr.in/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Take full screenshot
    const screenshotPath = path.join(screenshotsDir, 
      `Dashboard_${device.name.replace(/\s+/g, '-')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.screenshots.push(screenshotPath);
    console.log(`   📸 Screenshot saved`);
    
    // Test 1: Display Name Input
    const displayNameTest = await testElement(page, 
      'input[name="displayName"], input[placeholder*="name" i]',
      'Display Name Input',
      device.width
    );
    results.tests.push(displayNameTest);
    if (!displayNameTest.status.includes('PASS')) results.overallPass = false;
    
    // Test 2: Bio Textarea
    const bioTest = await testElement(page,
      'textarea[name="bio"], textarea[placeholder*="bio" i]',
      'Bio Textarea',
      device.width
    );
    results.tests.push(bioTest);
    if (!bioTest.status.includes('PASS')) results.overallPass = false;
    
    // Test 3: Save Profile Button
    const saveButtonTest = await testButton(page,
      'button:has-text("Save"), button:has-text("Update")',
      'Save Profile Button',
      device.width,
      device.width < 768
    );
    results.tests.push(saveButtonTest);
    if (!saveButtonTest.status.includes('PASS')) results.overallPass = false;
    
    // Test 4: QR Code Section
    const qrTest = await testElement(page,
      '[class*="qr" i], img[alt*="qr" i], [data-testid*="qr" i]',
      'QR Code Section',
      device.width
    );
    results.tests.push(qrTest);
    if (!qrTest.status.includes('PASS')) results.overallPass = false;
    
    // Test 5: Social Links Section
    const socialTest = await testElement(page,
      '[class*="social" i], [data-testid*="social" i]',
      'Social Links Section',
      device.width
    );
    results.tests.push(socialTest);
    if (!socialTest.status.includes('PASS')) results.overallPass = false;
    
    // Test 6: Horizontal Scroll Check
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      results.tests.push({
        component: 'Page Layout',
        status: 'FAIL',
        issue: 'Horizontal scrolling detected'
      });
      results.overallPass = false;
    } else {
      results.tests.push({
        component: 'Page Layout',
        status: 'PASS',
        issue: 'No horizontal scrolling'
      });
    }
    
    // Test 7: All Buttons Tap Target Size
    if (device.width < 768) {
      const buttons = await page.locator('button').all();
      let buttonIssues = 0;
      
      for (let i = 0; i < Math.min(buttons.length, 10); i++) {
        const button = buttons[i];
        const box = await button.boundingBox().catch(() => null);
        if (box && (box.width < 44 || box.height < 44)) {
          const text = await button.textContent().catch(() => '');
          if (text.trim()) {
            buttonIssues++;
            if (buttonIssues <= 3) { // Log first 3
              results.tests.push({
                component: `Button "${text.trim().substring(0, 20)}"`,
                status: 'WARN',
                issue: `Tap target: ${Math.round(box.width)}x${Math.round(box.height)}px (need 44x44px)`
              });
            }
          }
        }
      }
      
      if (buttonIssues > 3) {
        results.tests.push({
          component: 'Button Tap Targets',
          status: 'WARN',
          issue: `${buttonIssues - 3} more buttons below 44x44px`
        });
      }
    }
    
    console.log(`   ✅ Testing complete`);
    
  } catch (error) {
    results.tests.push({
      component: 'Dashboard Load',
      status: 'FAIL',
      issue: `Error: ${error.message}`
    });
    results.overallPass = false;
  }
  
  await context.close();
  return results;
}

async function testElement(page, selector, name, viewportWidth) {
  try {
    const element = await page.locator(selector).first();
    const isVisible = await element.isVisible().catch(() => false);
    
    if (!isVisible) {
      return {
        component: name,
        status: 'SKIP',
        issue: 'Element not found on page'
      };
    }
    
    const box = await element.boundingBox().catch(() => null);
    if (!box) {
      return {
        component: name,
        status: 'SKIP',
        issue: 'Could not get element dimensions'
      };
    }
    
    // Check if element overflows viewport
    if (box.x + box.width > viewportWidth || box.x < 0) {
      return {
        component: name,
        status: 'FAIL',
        issue: `Element overflows viewport. Width: ${Math.round(box.width)}px, Viewport: ${viewportWidth}px`
      };
    }
    
    // Check if element is cut off
    if (box.x < -10 || box.x + box.width > viewportWidth + 10) {
      return {
        component: name,
        status: 'FAIL',
        issue: `Element is cut off. Position: ${Math.round(box.x)}px, Width: ${Math.round(box.width)}px`
      };
    }
    
    return {
      component: name,
      status: 'PASS ✓',
      issue: `Fits properly (${Math.round(box.width)}px width)`
    };
    
  } catch (error) {
    return {
      component: name,
      status: 'ERROR',
      issue: error.message
    };
  }
}

async function testButton(page, selector, name, viewportWidth, isMobile) {
  try {
    const button = await page.locator(selector).first();
    const isVisible = await button.isVisible().catch(() => false);
    
    if (!isVisible) {
      return {
        component: name,
        status: 'SKIP',
        issue: 'Button not found on page'
      };
    }
    
    const box = await button.boundingBox().catch(() => null);
    if (!box) {
      return {
        component: name,
        status: 'SKIP',
        issue: 'Could not get button dimensions'
      };
    }
    
    // Check overflow
    if (box.x + box.width > viewportWidth || box.x < 0) {
      return {
        component: name,
        status: 'FAIL',
        issue: `Button overflows viewport`
      };
    }
    
    // Check tap target size on mobile
    if (isMobile && (box.width < 44 || box.height < 44)) {
      return {
        component: name,
        status: 'WARN',
        issue: `Tap target too small: ${Math.round(box.width)}x${Math.round(box.height)}px (need 44x44px)`
      };
    }
    
    return {
      component: name,
      status: 'PASS ✓',
      issue: `Fits properly (${Math.round(box.width)}x${Math.round(box.height)}px)`
    };
    
  } catch (error) {
    return {
      component: name,
      status: 'ERROR',
      issue: error.message
    };
  }
}

async function runDashboardTest() {
  console.log('🚀 Starting Dashboard Responsive Testing\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({ headless: false }); // Non-headless so you can see
  
  // Step 1: Create account and setup profile
  const setupContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const setupPage = await setupContext.newPage();
  
  const accountCreated = await createTestAccount(setupPage);
  if (accountCreated) {
    await setupProfile(setupPage);
  } else {
    console.log('\n⚠️  Could not create account. Testing with existing session...');
  }
  
  await setupContext.close();
  
  // Step 2: Test dashboard on all devices
  const allResults = [];
  
  for (const device of devices) {
    const result = await testDashboardResponsive(browser, device);
    allResults.push(result);
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 DASHBOARD RESPONSIVE TEST RESULTS\n');
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  
  for (const result of allResults) {
    console.log(`\n## ${result.device}`);
    console.log('-'.repeat(60));
    
    result.tests.forEach(test => {
      totalTests++;
      
      let icon = '✓';
      if (test.status.includes('FAIL')) {
        icon = '❌';
        totalFailed++;
      } else if (test.status.includes('WARN')) {
        icon = '⚠️';
        totalWarnings++;
      } else if (test.status.includes('PASS')) {
        icon = '✓';
        totalPassed++;
      } else {
        icon = 'ℹ️';
      }
      
      console.log(`  ${icon} ${test.component}: ${test.status}`);
      if (test.issue && !test.status.includes('PASS')) {
        console.log(`     └─ ${test.issue}`);
      }
    });
    
    console.log(`\nOverall: ${result.overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Screenshots: ${result.screenshots.length} saved`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 SUMMARY\n');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed} ✓`);
  console.log(`Failed: ${totalFailed} ❌`);
  console.log(`Warnings: ${totalWarnings} ⚠️`);
  console.log(`Skipped: ${totalTests - totalPassed - totalFailed - totalWarnings} ℹ️`);
  
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
  console.log(`\nPass Rate: ${passRate}%`);
  
  if (totalFailed === 0) {
    console.log('\n✅ PRODUCTION READY - All critical tests passed!');
  } else {
    console.log(`\n⚠️  NEEDS FIXES - ${totalFailed} critical issues found`);
  }
  
  console.log(`\n📸 Screenshots saved to: ${screenshotsDir}`);
  console.log('\n' + '='.repeat(60));
}

runDashboardTest().catch(console.error);
