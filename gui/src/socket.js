const ipcMain = require('electron'),
  net = require('net')

const PORT = 26878
const HOST = 'localhost'

const server = net.createServer((socket) => {
  socket.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        server.listen(PORT, HOST)
      }, 1000)
    } 
    else {
      console.log(e)
    }
  })
  
  socket.on('data', (e) => {
    console.log(e.toString())
  })
  
})
.listen(PORT, HOST, 5, () => console.log("Server listening on " + PORT))

