// Handles the electron build

const {app, BrowserWindow} = require('electron'),
  path = require('path'),
  url = require('url')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, './dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.on('ready', createWindow)