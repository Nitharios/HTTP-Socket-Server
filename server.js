// jshint esversion:6

const sanity = "You're not crazy!";
console.log('1st:', sanity);

///// ACTUAL CODE /////

const net = require('net');
const fs = require('fs');
// const http = require('http');
const PORT = process.env.PORT || 8080;

const server = net.createServer((request) => {
  request.setEncoding('utf8');

  console.log('2nd:', sanity);

  // request.write(sanity);

  request.on('data', (data) => {
    console.log('Client has emitted:\n' + data );
  });

  request.end();

  // async, runs more than once...
  request.on('end', () => {
    console.log('Client has disconnected');
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
// cojst server = http.createServer((request, response) => {
//   // request = setEncoding('utf8');
//   // sent twice?? two requests??? ASYNC...
//   console.log('Server: Someone has connected!');

//   response.writeHead(200, {"Content-Type" : "text/HTML"});
//   // writes to the front end
//   response.write(`${sanity} \r\n`);
//   response.end();
// });

// server.on('error', (err) => {
//   throw err;
// });


