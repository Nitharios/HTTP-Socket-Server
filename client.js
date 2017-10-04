/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const PORT = process.env.PORT || 8080;
const userAgent = 'nathan/1.1';
const method = 'GET';
const timeStamp = new Date();

let url = process.argv[2].split('/')[0];
let uri = process.argv[2].split('/')[1];

const request = new net.connect(PORT, () => {
  console.log(`Connected to server at port ${PORT}`);
  console.log('process', process.argv);

  // will send the request to the server
  generateRequest(request);

  process.stdin.pipe(request);
  request.pipe(process.stdout);

});

request.on('error', (err) => {
  throw err;
});

request.on('end', () => {
  console.log('\nDisconnected from server');
});

/* FUNCTIONS */

// generates the Request Header
function generateRequest(request) {
  request.write(`${method} /${uri} HTTP/1.1\nDate:${timeStamp}\nHost:${url}:${PORT}\nUser-Agent: ${userAgent}\nAccept:*/*`);
}

// generates the Request Body


// reads in data sent from server
request.on('data', (data) => {
  request.end();
});