document.addEventListener("DOMContentLoaded", function () {
  const clearCacheButton = document.getElementById("clear-cache");

  clearCacheButton.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "clearCache" }, function (response) {
      if (response && response.success) {
        alert("Cache cleared.");
        location.reload();
      } else {
        alert("Something went wrong, please try again.");
      }
    });
  });

  chrome.runtime.sendMessage({ action: "getMFES" }, function (response) {
    if (response && response.data) {
      const mfesData = response.data;

      if (typeof mfesData === "object" && Object.keys(mfesData).length > 0) {
        updateUI(mfesData);
      } else {
        const versionList = document.getElementById("version-list");
        versionList.innerHTML = "MFES data not found.";
      }
    } else {
      console.error("MFES data not received.");
    }
  });
});

function updateUI(mfesData) {
  const versionList = document.getElementById("version-list");
  versionList.innerHTML = "";

  const table = document.createElement("table");
  table.className = "data-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const emptyHeader = document.createElement("th");
  emptyHeader.textContent = "App Name";
  headerRow.appendChild(emptyHeader);

  for (const url in mfesData) {
    if (mfesData.hasOwnProperty(url)) {
      const th = document.createElement("th");
      th.textContent = getEnvironmentLabel(url);
      headerRow.appendChild(th);
    }
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  const allApps = Object.keys(mfesData[Object.keys(mfesData)[0]]);

  allApps.forEach((appName) => {
    const row = document.createElement("tr");

    const appNameCell = document.createElement("td");
    appNameCell.textContent = appName;
    row.appendChild(appNameCell);

    for (const url in mfesData) {
      if (mfesData.hasOwnProperty(url)) {
        const versionCell = document.createElement("td");
        const version = mfesData[url][appName]?.version || "N/A";
        versionCell.textContent = version;
        row.appendChild(versionCell);
      }
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  versionList.appendChild(table);
}

function getEnvironmentLabel(url) {
  if (url.includes("test")) return "test";
  if (url.includes("qa")) return "qa";
  if (url.includes("alpha")) return "alpha";
  return "prod";
}
