// jshint esversion:6

const sanity = "You're not crazy!";
console.log('1st:', sanity);

///// ACTUAL CODE /////

const net = require('net');
const fs = require('fs');
// const http = require('http');
const PORT = process.env.PORT || 8080;

const server = net.createServer((client) => {
  client.setEncoding('utf8');

  console.log('2nd:', sanity);

  client.on('data', (data) => {
    console.log('Client has emitted:\n' + data );
  });

  client.end();

  client.on('end', () => {
    console.log('Client has disconnected');
  });
});

// cojst server = http.createServer((request, response) => {
//   // client = setEncoding('utf8');
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

server.on('error', (err) => {
  throw err;
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

