import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.BAZAARPK_BASE_URL || 'http://localhost:5174';
const AUTOMATION_EVIDENCE_DIR = 'docs/evidence/automation';
const PASS_SCREENSHOT = `${AUTOMATION_EVIDENCE_DIR}/checkout-flow-pass.png`;

async function seedCart(driver) {
  await driver.executeScript(`
    const seededState = {
      state: {
        items: [
          {
            quantity: 1,
            product: {
              id: 'auto-product-1',
              title: 'Automation Test Product',
              price: 2499,
              originalPrice: 2999,
              stock: 10,
              images: [],
              seller: { id: 'seller-1', storeName: 'Automation Seller' }
            }
          }
        ]
      },
      version: 0
    };
    localStorage.setItem('bazaarpk-cart', JSON.stringify(seededState));
  `);
}

async function run() {
  const options = new chrome.Options();
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
  }
  options.addArguments('--window-size=1440,900');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get(`${BASE_URL}/`);
    await driver.wait(until.elementLocated(By.xpath("//*[contains(., 'All Products')]")), 20000);
    await seedCart(driver);

    await driver.get(`${BASE_URL}/checkout`);
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(., 'Checkout')]")), 20000);

    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Place Order')]")), 10000);
    await driver.findElement(By.xpath("//button[contains(., 'Place Order')]")).click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(., 'Order Placed Successfully')]")),
      20000
    );
    await mkdir(AUTOMATION_EVIDENCE_DIR, { recursive: true });
    const screenshot = await driver.takeScreenshot();
    await writeFile(PASS_SCREENSHOT, screenshot, 'base64');
    console.log('Selenium checkout-flow test passed.');
    console.log(`Saved pass evidence screenshot: ${PASS_SCREENSHOT}`);
  } finally {
    await driver.quit();
  }
}

run().catch((error) => {
  console.error('Selenium checkout-flow test failed.');
  console.error(error);
  process.exit(1);
});
