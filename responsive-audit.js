const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Viewport configurations
const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'Pixel 5', width: 393, height: 851 },
  { name: 'Galaxy S20', width: 360, height: 800 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

// Pages to test
const pages = [
  { name: 'Homepage', url: 'https://tappr.in' },
  { name: 'Login', url: 'https://tappr.in/login' },
  { name: 'Signup', url: 'https://tappr.in/signup' },
  { name: 'Pricing', url: 'https://tappr.in/pricing' },
  { name: 'Dashboard', url: 'https://tappr.in/dashboard' },
];

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'responsive-audit-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function checkOverflow(page, selector) {
  try {
    const element = await page.locator(selector).first();
    const isVisible = await element.isVisible().catch(() => false);
    if (!isVisible) return null;

    const box = await element.boundingBox().catch(() => null);
    if (!box) return null;

    const viewport = page.viewportSize();
    
    return {
      isOverflowing: box.x + box.width > viewport.width || box.y + box.height > viewport.height,
      isCutOff: box.x < 0 || box.x + box.width > viewport.width,
      box,
      viewport
    };
  } catch (e) {
    return null;
  }
}

async function testPage(browser, device, pageInfo) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height }
  });
  const page = await context.newPage();
  
  const results = {
    device: `${device.name} (${device.width}x${device.height})`,
    page: pageInfo.name,
    url: pageInfo.url,
    issues: [],
    screenshots: []
  };

  try {
    console.log(`Testing ${pageInfo.name} on ${device.name}...`);
    await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);

    // Take initial screenshot
    const screenshotPath = path.join(screenshotsDir, 
      `${device.name.replace(/\s+/g, '-')}_${pageInfo.name.replace(/\s+/g, '-')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.screenshots.push(screenshotPath);

    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (hasHorizontalScroll) {
      results.issues.push({
        element: 'Page',
        issue: 'Horizontal scrolling detected - page width exceeds viewport',
        severity: 'CRITICAL'
      });
    }

    // Dashboard-specific tests
    if (pageInfo.name === 'Dashboard') {
      const selectors = [
        { name: 'Display Name input', selector: 'input[name="displayName"], input[placeholder*="name" i]' },
        { name: 'Bio textarea', selector: 'textarea[name="bio"], textarea[placeholder*="bio" i]' },
        { name: 'Save Profile button', selector: 'button:has-text("Save"), button:has-text("Update")' },
        { name: 'QR Code section', selector: '[class*="qr" i], img[alt*="qr" i]' },
        { name: 'Social Links section', selector: '[class*="social" i]' }
      ];

      for (const { name, selector } of selectors) {
        const overflow = await checkOverflow(page, selector);
        if (overflow && overflow.isCutOff) {
          results.issues.push({
            element: name,
            issue: `Element is cut off or overflowing viewport. Width: ${overflow.box.width}px, Viewport: ${overflow.viewport.width}px`,
            severity: 'FAIL'
          });
        }
      }
    }

    // Generic button tests
    const buttons = await page.locator('button').all();
    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      const button = buttons[i];
      const box = await button.boundingBox().catch(() => null);
      if (box) {
        if (box.x + box.width > device.width || box.x < 0) {
          const text = await button.textContent().catch(() => '');
          results.issues.push({
            element: `Button "${text.trim().substring(0, 30)}"`,
            issue: 'Button is cut off or overflowing viewport',
            severity: 'FAIL'
          });
        }
        // Check tap target size
        if (device.width < 768 && (box.width < 44 || box.height < 44)) {
          const text = await button.textContent().catch(() => '');
          results.issues.push({
            element: `Button "${text.trim().substring(0, 30)}"`,
            issue: `Tap target too small: ${Math.round(box.width)}x${Math.round(box.height)}px (minimum 44x44px)`,
            severity: 'WARN'
          });
        }
      }
    }

    // Check inputs
    const inputs = await page.locator('input, textarea').all();
    for (let i = 0; i < Math.min(inputs.length, 20); i++) {
      const input = inputs[i];
      const box = await input.boundingBox().catch(() => null);
      if (box && (box.x + box.width > device.width || box.x < 0)) {
        const name = await input.getAttribute('name').catch(() => '');
        const placeholder = await input.getAttribute('placeholder').catch(() => '');
        results.issues.push({
          element: `Input ${name || placeholder || i}`,
          issue: 'Input field is cut off or overflowing viewport',
          severity: 'FAIL'
        });
      }
    }

  } catch (error) {
    results.issues.push({
      element: 'Page Load',
      issue: `Error testing page: ${error.message}`,
      severity: 'ERROR'
    });
  }

  await context.close();
  return results;
}

async function runAudit() {
  console.log('🔍 Starting Comprehensive Responsive QA Audit\n');
  
  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (const device of devices) {
    for (const pageInfo of pages) {
      const result = await testPage(browser, device, pageInfo);
      allResults.push(result);
    }
  }

  await browser.close();

  // Generate report
  const reportPath = path.join(__dirname, 'responsive-audit-report.md');
  let report = '# QR Connect - Comprehensive Responsive Audit Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Total Tests:** ${allResults.length}\n\n`;
  report += '---\n\n';

  for (const result of allResults) {
    report += `## Device: ${result.device}\n\n`;
    report += `### Page: ${result.page} (${result.url})\n\n`;
    
    if (result.issues.length === 0) {
      report += '✅ **ALL PASS** - No responsive issues detected\n\n';
    } else {
      report += `❌ **${result.issues.length} ISSUES FOUND:**\n\n`;
      result.issues.forEach((issue, idx) => {
        const icon = issue.severity === 'CRITICAL' || issue.severity === 'FAIL' ? '❌' : 
                     issue.severity === 'WARN' ? '⚠️' : 'ℹ️';
        report += `${idx + 1}. ${icon} **${issue.element}**\n`;
        report += `   - Issue: ${issue.issue}\n`;
        report += `   - Severity: ${issue.severity}\n\n`;
      });
    }

    if (result.screenshots.length > 0) {
      report += `**Screenshots:**\n`;
      result.screenshots.forEach(screenshot => {
        report += `- ${screenshot}\n`;
      });
    }

    report += '\n---\n\n';
  }

  // Summary
  const totalIssues = allResults.reduce((sum, r) => sum + r.issues.length, 0);
  const criticalIssues = allResults.reduce((sum, r) => 
    sum + r.issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'FAIL').length, 0);

  report += '## Summary\n\n';
  report += `- **Total Issues:** ${totalIssues}\n`;
  report += `- **Critical/Fail:** ${criticalIssues}\n`;
  report += `- **Pages Tested:** ${pages.length}\n`;
  report += `- **Devices Tested:** ${devices.length}\n`;
  report += `- **Total Test Runs:** ${allResults.length}\n\n`;

  if (criticalIssues === 0) {
    report += '✅ **AUDIT PASSED** - All pages are responsive!\n';
  } else {
    report += `❌ **AUDIT FAILED** - ${criticalIssues} critical issues require fixes\n`;
  }

  fs.writeFileSync(reportPath, report);
  console.log(`\n✅ Audit complete! Report saved to: ${reportPath}`);
  console.log(`📸 Screenshots saved to: ${screenshotsDir}`);
  console.log(`\n📊 Summary: ${totalIssues} total issues, ${criticalIssues} critical\n`);
}

runAudit().catch(console.error);
