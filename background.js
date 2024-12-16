/**
 * Array of URLs representing different environments to fetch MFE data from.
 * @type {string[]}
 */
const URLS = [
  "https://www.test.betsson.com/en",
  "https://www.qa.betsson.com/en",
  "https://www.alpha.betsson.com/en?isDebug=1",
  "https://www.betsson.com/en?isDebug=1"
];

/**
 * Extracts obgStartup object from HTML content.
 * @param {string} html - HTML content to parse
 * @returns {Object|null} Parsed obgStartup object or null if not found/invalid
 */
function extractObgStartup(html) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    if (scriptContent.includes("obgStartup")) {
      const obgStartupMatch = scriptContent.match(/obgStartup\s*=\s*(\{.*?\});/);
      if (obgStartupMatch) {
        try {
          return JSON.parse(obgStartupMatch[1]);
        } catch (error) {
          console.error("Error parsing obgStartup JSON:", error);
        }
      }
    }
  }

  return null;
}

/**
 * Extracts version from window.nodeContext object in HTML content.
 * @param {string} html - HTML content to parse
 * @returns {string|null} Version string or null if not found/invalid
 */
function extractNodeContextVersion(html) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptContent = match[1];
    if (scriptContent.includes("window.nodeContext")) {
      const nodeContextMatch = scriptContent.match(/window\.nodeContext\s*=\s*(\{.*?\});/);
      if (nodeContextMatch) {
        try {
          const nodeContext = JSON.parse(nodeContextMatch[1]);
          if (nodeContext?.version) {
            return nodeContext.version;
          } else {
            console.warn("No version found in window.nodeContext.");
            return null;
          }
        } catch (error) {
          console.error("Error parsing nodeContext JSON:", error);
        }
      }
    }
  }

  return null;
}

/**
 * Fetches HTML content from a given URL.
 * @param {string} url - URL to fetch HTML from
 * @returns {Promise<string>} HTML content as string
 * @throws {Error} If fetch fails
 */
async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching HTML for ${url}:`, error);
    throw error;
  }
}

/**
 * Fetches and extracts MFE data from a given URL.
 * @param {string} url - URL to fetch MFE data from
 * @returns {Promise<Object>} Object containing MFE data with versions
 * @throws {Error} If fetch or parsing fails
 */
async function fetchMFESForURL(url) {
  try {
    const html = await fetchHTML(url);
    const obgStartup = extractObgStartup(html);
    const obgStateVersion = extractNodeContextVersion(html);

    if (obgStartup?.mfes) {
      obgStartup.mfes["OBGA"] = { version: obgStateVersion };
      return obgStartup.mfes;
    } else {
      console.warn(`No MFES data found for ${url}`);
      return {};
    }
  } catch (error) {
    console.error(`Error fetching MFES for ${url}:`, error);
    throw error;
  }
}

/**
 * Chrome runtime message listener for handling MFE-related requests.
 * Supports actions: getMFES, fetchMFESForURL
 * @param {Object} message - Message object containing action and data
 * @param {Object} sender - Sender information
 * @param {Function} sendResponse - Callback function to send response
 * @returns {boolean|undefined} True if response is async, undefined otherwise
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMFES") {
    sendResponse({ urls: URLS });
  }

  if (message.action === "fetchMFESForURL") {
    fetchMFESForURL(message.url)
      .then((mfesData) => {
        sendResponse({ success: true, mfesData });
      })
      .catch((error) => {
        console.error(`Error fetching data for ${message.url}:`, error);
        sendResponse({ success: false });
      });

    return true;
  }
});