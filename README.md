# OBGA MFE Versions Viewer Chrome Extension

<img width="467" alt="icon" src="https://github.com/user-attachments/assets/f2b8bacc-b977-4281-8e98-ee555405f8fb">


This Chrome extension is designed for internal use to display version information for different micro front-end (MFE) applications, such as "app-a" or "app-b" The extension reads JavaScript variables from a web page and presents the version details in a simple, user-friendly popup.

## Features

- **Displays version information** of different OBGA MFE applications in a clean and organized UI.
- **Easy access** by clicking the extension icon on the Chrome toolbar.
- **Lightweight and fast**, designed for internal use in our company.

## Installation

To use this extension, follow these steps:

### 1. Clone or Download the Repository

You can clone the repository using Git or download it as a ZIP file:

#### Clone the Repository

```sh
git clone https://github.com/aghu01/obga-mfe-version-viewer
```

#### Download as ZIP

- Click on the green "Code" button on the GitHub repository page.
- Select "Download ZIP."
- Extract the ZIP file to a folder on your computer.

### 2. Load the Extension into Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions/` in your address bar.
3. **Enable "Developer mode"** by clicking the toggle in the top-right corner.
4. Click on the **"Load unpacked"** button.
5. Browse and select the folder where you extracted/cloned the extension.

Once done, you should see the OBGA MFE Versions extension appear in your list of Chrome extensions.

### 3. Using the Extension

- After loading the extension, you will see the extension icon in your Chrome toolbar.
- Navigate to an internal page that contains the MFE version information.
- **Click on the extension icon**: A popup will open displaying the version information of the different apps, such as:
  ```
  app-a: 1.0.1
  app-b: 1.1.1
  ```
- Each app name is displayed in **bold**, followed by its version.

## Troubleshooting

If you encounter any issues while using the extension, consider the following steps:

- Ensure you are on a supported internal webpage. This extension reads specific JavaScript variables, which may not be present on every page.
- If the extension does not display any version information, press `F12` to open Chrome's DevTools and check the **Console** tab for any errors.
- Refresh the page and try clicking the extension icon again if the version information does not load immediately.

## Development

If you'd like to make changes to the extension, feel free to modify the code and submit a pull request.

### File Structure

- **manifest.json**: Describes the extension, including permissions and components used.
- **popup.html**: Defines the HTML for the popup that appears when the extension icon is clicked.
- **popup.js**: Contains the logic for handling the version data and updating the UI.
- **content.js**: Executes in the context of the webpage to extract the version information.
- **inject.js**: Injected script to access JavaScript variables directly from the page.
- **icon.png**: The extension icon, used in various sizes (16x16, 48x48, 128x128).

### Running Locally

To test your changes, follow these steps:

1. Make your changes in the local files.
2. Refresh the extension on the `chrome://extensions/` page by clicking the **Refresh** button next to the extension name.
3. Test the changes in Chrome by clicking on the extension icon.

## Contribution

We welcome contributions from the team to improve this extension.

- **Pull Requests**: If you have an enhancement or fix, create a pull request.
- **Issues**: If you encounter any issues, please report them by opening an issue in the GitHub repository.

### Screenshots
<img width="322" alt="Screenshot 2024-10-05 at 15 37 39" src="https://github.com/user-attachments/assets/b9c54e0d-9eb2-4f00-b579-94cd55955aa5">
<img width="340" alt="Screenshot 2024-10-05 at 15 48 06" src="https://github.com/user-attachments/assets/5e76ac4b-2060-4165-9c35-edd3c0fd584a">


