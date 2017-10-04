/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const PORT = process.env.PORT || 8080;
const userAgent = 'nathan/1.1';
const method = 'GET';
const timeStamp = new Date();

let commandLineInput = process.argv;
let url, uri, flag;

const request = new net.connect(PORT, () => {
  console.log(`Connected to server at port ${PORT}`);
  console.log('process', process.argv);

  // will send the request to the server
  commandHandler(commandLineInput);
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

// deals with command line input
function commandHandler(input) {
  // first input should be node directory
  // second input should be the file to access
  // third input COULD be a flag or link
  // fourth input COULD be a link or null
}


// generates the Request Header
function generateRequest(request) {
  request.write(`${method} /${uri} HTTP/1.1\nDate:${timeStamp}\nHost:${url}:${PORT}\nUser-Agent: ${userAgent}\nAccept:*/*`);
}

// generates the Request Body


// reads in data sent from server
request.on('data', (data) => {
  request.end();
});