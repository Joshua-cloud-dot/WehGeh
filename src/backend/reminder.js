const puppeteer = require('puppeteer');
const fs = require('fs');
const schedule = require('node-schedule');

let message = "nothing set";

function changeMessage(msg) {
  message = msg;
}

const sendReminder = async (page) => {
  console.log('sending Message');
  const messageBarSelector = 'div[aria-label="Type a message"]';//
  // Wait for the chat to open and the message input box to be available
  await page.waitForSelector(messageBarSelector, { visible: true });
  await page.click(messageBarSelector);



  // // Type the message
  await page.type(messageBarSelector, message, { delay: 100 });  // Adding a small delay for better typing simulation
  //
  // // Press Enter to send the message
  await page.keyboard.press('Enter');

  console.log('Message sent!');
}




async function sendWeeklyReminders() {
  const browser = await puppeteer.launch({ headless: false });  // Open a visible browser window
  const page = await browser.newPage();



  // Check if cookies file exists
  // if (fs.existsSync('cookies.json')) {
  //   const cookies = JSON.parse(fs.readFileSync('cookies.json'));
  //   console.log('Loaded Cookies:', cookies);
  //
  //   // Set the cookies for the browser context
  //   await browser.setCookie(...cookies);
  //   console.log('Cookies applied to browser.');
  // } else {
  //   console.log('No cookies found. Please scan the QR code first.');
  // }


  // connect to Whats App Web to start session
  await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle0' });


  // Wait for the main page to load after login
  // await page.waitForSelector('div[title="Chat list"]', { visible: true });


  // Navigate to contact and into the message box
  // Wait for the search bar to be available and type the contact name
  const contactName = 'Joschmann';  // Replace with your contact name
  const searchBarSelector = 'div[aria-label="Search"]';
  await page.waitForSelector(searchBarSelector, { visible: true, timeout: 60000 });
  await page.click(searchBarSelector);
  await page.type(searchBarSelector, contactName, { delay: 100 });  // Adding a small delay for better typing simulation



  // Wait for the span element that contains the contact name to appear
  await page.waitForSelector(`span[title="${contactName}"]`, { visible: true });

  // Click the contact once it appears
  await page.click(`span[title="${contactName}"]`);
  //
  const job = schedule.scheduleJob('0 * * * 3', function () {
    console.log('The answer to life, the universe, and everything!');
    sendReminder(page);
  });


  // Optionally, close the browser after sending the message
  // await browser.close();

  // go into infinite loop 
  // while (browser.connected);
}

// sendWeeklyReminders().catch(console.error);

exports.sendWeeklyReminders = sendWeeklyReminders;
exports.changeMessage = changeMessage;


