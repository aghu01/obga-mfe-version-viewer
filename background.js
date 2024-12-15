let cachedData = null;

async function fetchMFES() {
  const URLS = [
    "https://www.test.betsson.com/en",
    "https://www.qa.betsson.com/en",
    "https://www.alpha.betsson.com/en",
    "https://www.betsson.com/en",
  ];

  const mfesData = {};

  for (const url of URLS) {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
      let match;
      let obgStartup = null;

      while ((match = scriptRegex.exec(html)) !== null) {
        const scriptContent = match[1];
        if (scriptContent.includes("obgStartup")) {
          try {
            const obgStartupMatch = scriptContent.match(
              /obgStartup\s*=\s*(\{.*?\});/
            );
            if (obgStartupMatch) {
              obgStartup = JSON.parse(obgStartupMatch[1]);
              break;
            }
          } catch (error) {
            console.error("obgStartup JSON parse error:", error);
          }
        }
      }

      if (obgStartup?.mfes) {
        mfesData[url] = obgStartup.mfes;
      } else {
        mfesData[url] = {};
      }
    } catch (error) {
      console.error(`${url} fetch error:`, error);
    }
  }

  cachedData = mfesData;
  return mfesData;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMFES") {
    if (cachedData) {
      sendResponse({ data: cachedData });
    } else {
      fetchMFES().then((data) => {
        sendResponse({ data });
      });
    }
    return true;
  }

  if (message.action === "clearCache") {
    cachedData = null;
    sendResponse({ success: true });
    return true;
  }
});
