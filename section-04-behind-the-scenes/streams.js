const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // solution 1 : load entire file
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  // solution 2 : Streams
  // // readStream
  // const readable = fs.createReadStream('test-filde.txt');
  // readable.on('data', (chunk) => {
  //   // writeStream
  //   res.write(chunk);
  //   res.end();
  // });
  // readable.on('error', (err) => {
  //   res.statusCode = 404;
  //   res.end('File not found');
  // });

  // solution 3 : pipe
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening ...');
});
