// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer, shell } = require("electron")
const got = require("got")

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// To access the electron app for minimize button
contextBridge.exposeInMainWorld("hideWindow", () => {
  ipcRenderer.invoke("hide")
})

// To open external URL in browser
contextBridge.exposeInMainWorld("openExternalUrl", (url) => {
  shell.openExternal(url)
})

// To check status info for LongAP devices
contextBridge.exposeInMainWorld("getLongAPStatus", async (address) => {
  try {
    let res = await got(
      "https://status.longap.com/hotspot/status/" + address
    ).json()
    return res
  } catch (e) {
    console.error(e)
    return "failed"
  }
})
