(function () {
  try {
    const mfes = window.obgStartup && window.obgStartup.mfes;

    window.postMessage({ type: "OBG_MFES_VERSION_INFO", version: mfes }, "*");
  } catch (error) {
    console.error("Version information not available:", error);
  }
})();
