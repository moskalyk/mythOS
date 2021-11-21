
import { addEntry, registerTextState } from '_aqua/app';

let ws = require('ws');
const server = new ws.Server({
  port: 8080
});

let sockets: any = [];
server.on('connection', function(socket: any) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg: any) {
  	console.log('receiving')
  	console.log(msg)
    // sockets.forEach(s => s.send(msg));
  });

  // // When a socket closes, or disconnects, remove it from the array.
  // socket.on('close', function() {
  //   sockets = sockets.filter(s => s !== socket);
  // });
});
