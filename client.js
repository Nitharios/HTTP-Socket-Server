/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const PORT = process.env.PORT || 8080;
const userAgent = 'nathan/1.1';
const timeStamp = new Date();

// returns an array
let commandLineInput = process.argv;
let url, uri, flag, method;

const request = new net.connect(PORT, () => {
  console.log(`Connected to server at port ${PORT}`);
  // console.log('process', process.argv);

  // will send the request to the server
  commandHandler(commandLineInput);
  generateRequest(request, method);

  process.stdin.pipe(request);
  request.pipe(process.stdout);
});

request.on('error', (err) => {
  throw err;
});

request.on('end', () => {
  console.log('Disconnected from server');
});

/* FUNCTIONS */

// deals with command line input, parameter is an array
function commandHandler(input) {
  // zero index should be node directory
  // first index should be access file
  // second index COULD be a flag or link
  // third index COULD be a link or null
  if (input[2] === '-I') {
      method = 'HEAD';
      
      if (input[3].toLowerCase().includes('www')) {
        url = input[3].split('/')[0];
        console.log(url);
        uri = input[3].split('/')[1];
      }

  } else if (input[2].toLowerCase().includes('www')) {
    method = 'GET';
    url = input[2].split('/')[0];
    uri = input[2].split('/')[1];
  } 
}

// generates the Request Header
function generateRequest(request, method) {
  request.write(`${method} /${uri} HTTP/1.1\nDate:${timeStamp}\nHost:${url}:${PORT}\nUser-Agent: ${userAgent}\nAccept:*/*`, (err) => {
    if (err) throw err;
  });
}

// generates the Request Body


// reads in data sent from server
request.on('data', (data) => {
  console.log('here');
  request.end();
});