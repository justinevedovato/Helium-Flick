const path = require("path")
const AutoLaunch = require("auto-launch")
const { app, BrowserWindow, screen, Tray, Menu, ipcMain } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

let windowSize = {
  w: 400,
  h: 540,
}

let tray = null
let win

// Start on launch
var autoLauncher = new AutoLaunch({
  name: "Helium-Flick",
})
// Checking if autoLaunch is enabled, if not then enabling it.
// autoLauncher
//   .isEnabled()
//   .then(function (isEnabled) {
//     if (isEnabled) return
//     autoLauncher.enable()
//   })
//   .catch(function (err) {
//     throw err
//   })

// Calculate position of the window according to screen size (bottom right)
function calcWindowPosition() {
  let display = screen.getPrimaryDisplay()
  let { width, height } = display.workArea
  return {
    x: width - windowSize.w - 10,
    y: height - windowSize.h - 10,
  }
}

// Create the window object
function createWindow() {
  let { x, y } = calcWindowPosition()
  win = new BrowserWindow({
    width: windowSize.w,
    height: windowSize.h,
    x,
    y,
    maxWidth: windowSize.w,
    minWidth: windowSize.w,
    frame: false,
    transparent: true,
    resizable: true,
    skipTaskbar: true,
    movable: true,
    alwaysOnTop: true,
    icon: path.join(__dirname, "../public/logo2.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })
  // and load the index.html of the app.
  // win.loadFile("index.html");
  if (isDev) {
    win.loadURL(
      "http://localhost:3000" //`file://${path.join(__dirname, "../dist/index.html")}`
    )
  } else {
    win.loadFile("dist/index.html")
  }
  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools()
  // }
}

// When click on minimize button
ipcMain.handle("hide", () => {
  win.hide()
})

// Context menu when right-click on the icon in taskbar + open the window
app.whenReady().then(() => {
  tray = new Tray(
    path.join(__dirname, "../", isDev ? "public" : "dist", "tray.png")
  )
  const contextMenu = Menu.buildFromTemplate([
    {
      id: "autolaunch",
      label: "Run at startup",
      type: "checkbox",
      checked: false,
      click() {
        autoLauncher.isEnabled().then((enabled) => {
          !enabled ? autoLauncher.enable() : autoLauncher.disable()
        })
      },
    },

    {
      label: "Always on top",
      type: "checkbox",
      checked: true,
      click() {
        win.setAlwaysOnTop(!win.isAlwaysOnTop())
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click() {
        tray.destroy()
        app.quit()
      },
    },
  ])

  autoLauncher.isEnabled().then((enabled) => {
    const autolaunchItem = contextMenu.getMenuItemById("autolaunch")
    autolaunchItem.checked = enabled
  })

  tray.setToolTip("HeliumFlick")
  tray.addListener("click", () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
  tray.setContextMenu(contextMenu)
  createWindow()

  app.on("minimize", () => {
    win.hide()
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    tray.destroy()
    app.quit()
  }
})
