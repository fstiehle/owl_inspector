// Handles the electron build
const { app, BrowserWindow } = require('electron'),
  path = require('path'),
  url = require('url'),
  SocketCommunication = require('./socket.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1000,
    minWidth: 750,
    height: 800,
    minHeight: 450,
    show: false,
    titleBarStyle: "hiddenInset",
    vibrancy: "light",
    backgroundColor: '#191919'
  })

  // and load the index.html of the app.
  window.loadURL(url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
  })
}

app.on('ready', createWindow)

// dispatch child processes 