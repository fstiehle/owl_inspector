// Handles the electron build

const { app, BrowserWindow } = require('electron'),
  path = require('path'),
  url = require('url')

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    titleBarStyle: "hiddenInset",
    vibrancy: "light",
    backgroundColor: '#191919'
  })

  /* let child = new BrowserWindow({
    height: 200, parent: window, show: false}) */

  // and load the index.html of the app.
  window.loadURL(url.format({
    pathname: path.join(__dirname, './dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
    /* child.show() */
  })
}

app.on('ready', createWindow)