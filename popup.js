/**
 * Event listener that initializes the popup when DOM content is loaded.
 * Fetches MFE (Micro Frontend) data and displays it in a table format.
 */
document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage({ action: "getMFES" }, function (response) {
    if (response && response.urls) {
      const versionList = document.getElementById("version-list");
      versionList.innerHTML = "";

      const table = initializeTable(response.urls);
      versionList.appendChild(table);

      const orderedUrls = orderUrls(response.urls);

      orderedUrls.forEach((url) => {
        chrome.runtime.sendMessage({ action: "fetchMFESForURL", url }, function (data) {
          if (data && data.success && data.mfesData) {
            appendDataToTable(table, url, data.mfesData, orderedUrls);
          } else {
            console.error(`Error fetching data for ${url}`);
          }
        });
      }); 
    } else {
      console.error("No URLs received from background script.");
    }
  });
});

/**
 * Orders URLs based on environment priority.
 * @param {string[]} urls - Array of URLs to be ordered
 * @returns {string[]} Ordered array of URLs based on environment priority
 */
function orderUrls(urls) {
  const priorities = { test: 1, qa: 2, alpha: 3, prod: 4 };

  return urls.sort((a, b) => {
    const envA = getEnvironmentLabel(a);
    const envB = getEnvironmentLabel(b);

    return (priorities[envA] || 5) - (priorities[envB] || 5);
  });
}

/**
 * Creates and initializes the table structure for displaying MFE data.
 * @param {string[]} urls - Array of URLs to create table headers
 * @returns {HTMLTableElement} Initialized table element with headers
 */
function initializeTable(urls) {
  const table = document.createElement("table");
  table.className = "data-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const emptyHeader = document.createElement("th");
  emptyHeader.textContent = "Name";
  headerRow.appendChild(emptyHeader);

  orderUrls(urls).forEach((url) => {
    const th = document.createElement("th");
    th.textContent = getEnvironmentLabel(url);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  return table;
}

/**
 * Appends or updates MFE data in the table for a specific URL.
 * @param {HTMLTableElement} table - The table element to append data to
 * @param {string} url - The URL associated with the MFE data
 * @param {Object} mfesData - The MFE data to be displayed
 * @param {string[]} orderedUrls - Ordered array of URLs for column alignment
 */
function appendDataToTable(table, url, mfesData, orderedUrls) {
  const tbody = table.querySelector("tbody");

  const allApps = Object.keys(mfesData).filter((app) => !app.includes("example")).sort();

  allApps.forEach((appName) => {
    let row = tbody.querySelector(`tr[data-app-name="${appName}"]`);

    if (!row) {
      row = document.createElement("tr");
      row.setAttribute("data-app-name", appName);

      const appNameCell = document.createElement("td");
      appNameCell.textContent = appName;
      row.appendChild(appNameCell);

      orderedUrls.forEach((url) => {
        const emptyCell = document.createElement("td");
        emptyCell.setAttribute("data-url", url);
        emptyCell.textContent = "N/A";
        row.appendChild(emptyCell);
      });

      tbody.appendChild(row);
    }

    const versionCell = row.querySelector(`td[data-url="${url}"]`);
    versionCell.textContent = mfesData[appName]?.version || "N/A";

    highlightInconsistencies(row, orderedUrls);
  });
}

/**
 * Highlights version inconsistencies across environments in the table.
 * Colors cells based on version comparisons:
 * - Red (#ffcccc): Version is behind
 * - Green (#ccffcc): Version is ahead or current
 * - Yellow (#fff6b0): Production version is behind alpha
 * @param {HTMLTableRowElement} row - The table row to check for inconsistencies
 * @param {string[]} orderedUrls - Ordered array of URLs for comparison
 */
function highlightInconsistencies(row, orderedUrls) {
  const versions = [];

  orderedUrls.forEach((url) => {
    const cell = row.querySelector(`td[data-url="${url}"]`);
    const version = cell.textContent !== "N/A" ? cell.textContent : null;
    versions.push({ version, cell });
  });

  for (let i = 0; i < versions.length - 1; i++) {
    const current = versions[i].version;
    const next = versions[i + 1].version;

    if (current !== null && next !== null) {
      const comparison = compareVersions(next, current);
      if (comparison > 0) {
        versions[i].cell.style.backgroundColor = "#ffcccc";
      } else {
        versions[i].cell.style.backgroundColor = "#ccffcc";
      }
    }
  }

  const alpha = versions[versions.length - 2];
  const prod = versions[versions.length - 1];

  if (alpha.version !== null && prod.version !== null) {
    const comparison = compareVersions(prod.version, alpha.version);

    if (comparison < 0) {
      prod.cell.style.backgroundColor = "#fff6b0";
    } else if (comparison > 0) {
      alpha.cell.style.backgroundColor = "#ffcccc";
      prod.cell.style.backgroundColor = "#ccffcc";
    } else {
      prod.cell.style.backgroundColor = "#ccffcc";
    }
  }
}

/**
 * Compares two version strings.
 * @param {string} v1 - First version string
 * @param {string} v2 - Second version string
 * @returns {number} Returns:
 *  1 if v1 is greater than v2
 * -1 if v1 is less than v2
 *  0 if versions are equal
 */
function compareVersions(v1, v2) {
  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const part1 = v1Parts[i] || 0;
    const part2 = v2Parts[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

/**
 * Extracts environment label from a URL.
 * @param {string} url - URL to extract environment label from
 * @returns {string} Environment label ('test', 'qa', 'alpha', or 'prod')
 */
function getEnvironmentLabel(url) {
  if (url.includes("test")) return "test";
  if (url.includes("qa")) return "qa";
  if (url.includes("alpha")) return "alpha";
  return "prod";
}
