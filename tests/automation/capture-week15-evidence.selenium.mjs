import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import 'chromedriver';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE_URL = process.env.BAZAARPK_BASE_URL || 'http://localhost:5174';
const ROOT_EVIDENCE_DIR = 'docs/evidence';

async function saveScreenshot(driver, testCaseId, fileName = 'after.png') {
  const targetDir = `${ROOT_EVIDENCE_DIR}/${testCaseId}`;
  await mkdir(targetDir, { recursive: true });
  const screenshot = await driver.takeScreenshot();
  await writeFile(`${targetDir}/${fileName}`, screenshot, 'base64');
}

async function run() {
  const options = new chrome.Options();
  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
  }
  options.addArguments('--window-size=1440,900');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    const steps = [
      ['TC-01', '/register'],
      ['TC-02', '/login'],
      ['TC-03', '/'],
      ['TC-04', '/'],
      ['TC-05', '/cart'],
      ['TC-06', '/checkout'],
      ['TC-07', '/orders'],
      ['TC-08', '/seller/onboarding'],
      ['TC-09', '/admin/disputes'],
      ['TC-10', '/'],
    ];

    for (const [testCase, route] of steps) {
      await driver.get(`${BASE_URL}${route}`);
      await driver.sleep(1600);
      if (testCase === 'TC-10') {
        await driver.executeScript("setTimeout(() => { throw new Error('Week15 crash simulation from Selenium'); }, 0);");
        await driver.sleep(1000);
      }
      await saveScreenshot(driver, testCase);
    }

    console.log('Week 15 manual evidence screenshots captured under docs/evidence/TC-01..TC-10');
  } finally {
    await driver.quit();
  }
}

run().catch((error) => {
  console.error('Failed to capture Week 15 manual evidence screenshots.');
  console.error(error);
  process.exit(1);
});
