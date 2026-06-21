import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewportSize({ width: 900, height: 700 });

await page.goto('http://localhost:5173');
await page.waitForLoadState('networkidle');

// Screenshot 1: initial state
await page.screenshot({ path: '/tmp/composer-01-initial.png', fullPage: true });
console.log('✓ 1/7 initial state');

// Activate Web Search chip
await page.click('button[role="switch"]:has-text("Web Search")');
await page.screenshot({ path: '/tmp/composer-02-websearch.png', fullPage: true });
console.log('✓ 2/7 Web Search activated');

// Activate Code Interpreter (has config panel)
await page.click('button[role="switch"]:has-text("Code Interpreter")');
await page.screenshot({ path: '/tmp/composer-03-config.png', fullPage: true });
console.log('✓ 3/7 Code Interpreter + config panel');

// Open dropdown menu
await page.click('button[aria-label="Open tool menu (Ctrl+/)"]');
await page.screenshot({ path: '/tmp/composer-04-menu.png', fullPage: true });
console.log('✓ 4/7 Tool menu open');

// Toggle Image Generation (conflicts with Code Interpreter — auto-removes it)
await page.click('[role="menuitemcheckbox"]:has-text("Image Generation")');
await page.screenshot({ path: '/tmp/composer-05-conflict.png', fullPage: true });
console.log('✓ 5/7 Image Generation on, Code Interpreter removed (conflict)');

// Close menu, type message, submit
await page.keyboard.press('Escape');
await page.fill('textarea[aria-label="Message"]', 'Analyze this CSV and generate a chart');
await page.screenshot({ path: '/tmp/composer-06-message.png', fullPage: true });
console.log('✓ 6/7 Message typed');

await page.click('button[aria-label="Send message"]');
await page.waitForTimeout(900);
await page.screenshot({ path: '/tmp/composer-07-sent.png', fullPage: true });
console.log('✓ 7/7 Sent — payload shown in UI');

await browser.close();
