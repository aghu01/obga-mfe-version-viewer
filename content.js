function injectScript(file_path) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(file_path);
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

injectScript("inject.js");

window.addEventListener("message", function (event) {
  if (
    event.source === window &&
    event.data.type &&
    event.data.type === "OBG_MFES_VERSION_INFO"
  ) {
    try {
      chrome.runtime.sendMessage({
        version:
          event.data?.version ||
          "Not available, please check the url, it must be one of the BETSSON brands and you must connect with vpn (or office network)",
      });
    } catch (error) {}
  }
});
