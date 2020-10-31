/**
 * Inherit EventEmitter
 *  */
// const EventEmitter = require('events');
// // inherits from EventEmitter
// class Sales extends EventEmitter {
//   constructor() {
//     super();
//   }
// }
// const myEmitter = new Sales();
// // Listener
// myEmitter.on('newSale', () => {
//   console.log('There was a new sale!');
// });

// myEmitter.on('newSale', () => {
//   console.log('Costumer name: Jonas!');
// });

// myEmitter.on('newSale', (item) => {
//   console.log(`There are ${item} items left in stock`);
// });

// // emit event
// myEmitter.emit('newSale', 9);

/**
 * Init server
 *  */

const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Request received');
});

server.on('request', (req, res) => {
  res.end('Another request');
});

server.on('close', () => {
  console.log('Server closed');
});

// start event loop
server.listen(3000, '127.0.0.1', () => {
  console.log('Waiting for request ...');
});
