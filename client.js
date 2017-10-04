/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const IP = process.env.IP || 'localhost';
console.log('IP', IP);
const PORT = process.env.PORT || 8080;
const userAgent = 'nathan/1.1';
const accept = 'text/html, application/json';
const connection = 'keep-alive';

const howTo = `\nHELP\n
  node [fileName] [,option] [path]\n\nOPTIONS\n
  -I fetch header
        Returns the header of the requested path; if left out, the body of path will be returned\n\n`;

// returns an array
let host, uri, flag, method;
let commandLineInput = process.argv;

commandHandler(commandLineInput);

const request = new net.connect({port: PORT, host: IP}, () => {
  console.log(`Connected to server at port ${PORT}`);
  // console.log('process', process.argv);

  // will send the request to the server
  // commandHandler(commandLineInput);
  generateRequest(request, method);

  // process.stdin.pipe(request);
  // request.pipe(process.stdout);
});

request.on('error', (err) => {
  throw err;
});

request.on('end', () => {
  console.log('\nDisconnected from server');
});

// reads in data sent from server
request.on('data', (data) => {
  // console.log(data.toString());
  let serverReply = data.toString();
  if (method === 'GET') serverReply = serverReply.slice(serverReply.indexOf('\n\n')+1, serverReply.length-1).trim();
  process.stdin.write(serverReply);
  request.end();
});

/* FUNCTIONS */

// deals with command line input, parameter is an array
function commandHandler(input) {
  // zero index should be node directory
  // first index should be access file
  // second index COULD be a flag or link
  // third index COULD be a link or null
  console.log('input', input);
  if (input[2] === '-I') {
      method = 'HEAD';
      
      if (input[3].toLowerCase().includes('www') || input[2].toLowerCase().includes('localhost')) {
        host = input[3].split('/')[0];
        console.log(host);
        uri = input[3].split('/')[1] || '';
      }

  } else if (input[2].toLowerCase().includes('www') || input[2].toLowerCase().includes('localhost')) {
    method = 'GET';
    host = input[2].split('/')[0] || input[2];
    // console.log('host', host);
    uri = input[2].split('/')[1] || '';
  
  } else {
    method = 'GET';
    process.stdin.write(howTo);
  } 
}

// generates the Request Header
function generateRequest(request, method) {
  request.write(`${method} /${uri} HTTP/1.1\nHost: ${host}:${PORT}\nConnection: ${connection}\nUser-Agent: ${userAgent}\nAccept: ${accept}`, (err) => {
    if (err) throw err;
  });
}

// generates the Request Body
