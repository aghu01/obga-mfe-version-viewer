document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (typeof message.version === "string") {
      const versionList = document.getElementById("version-list");
      versionList.innerHTML = message.version;
      return;
    }

    updateUI(message.version);
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});

function updateUI(versionData) {
  const versionList = document.getElementById("version-list");
  versionList.innerHTML = "";

  for (const appName in versionData) {
    if (versionData.hasOwnProperty(appName)) {
      const versionInfo = versionData[appName].version;

      const div = document.createElement("div");
      div.className = "version-item";

      const appNameSpan = document.createElement("span");
      appNameSpan.className = "version-name";
      appNameSpan.textContent = `${appName}: `;

      const versionSpan = document.createElement("span");
      versionSpan.textContent = versionInfo;

      div.appendChild(appNameSpan);
      div.appendChild(versionSpan);

      versionList.appendChild(div);
    }
  }
}
