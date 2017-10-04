/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

/* ACTUAL CODE */

const net = require('net');
const IP = process.env.IP || 'localhost';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
const accept = 'text/html, application/json';
const connection = 'keep-alive';

const howTo = `\nHELP\n
  node [fileName] [,option] [www.DEFINEPATH.extension]\n\nOPTIONS\n
  -I fetch header
        Returns the header of the requested path; if left out, the body of path will be returned\n\n`;

// returns an array
let host, uri, flag, method;
let PORT = process.env.PORT || 80;
let commandLineInput = process.argv;

commandHandler(commandLineInput);

const request = new net.connect({port: PORT, host: host}, () => {
  console.log(`Connected to server at port ${PORT}`);

  // will send the request to the server
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
  let serverReply = data.toString();

  if (method === 'GET') {
    serverReply = serverReply
    .slice(serverReply
    .indexOf('\n\n')+1, serverReply.length-1)
    .trim();
  }

  if (data.includes('302')) console.log (sanity);

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
  // console.log('input', input);
  input.forEach(setPort, input);

  if (input[2] === '-I') {
      method = 'HEAD';
      
      if (input[3].toLowerCase().includes('www') || 
        input[3].toLowerCase().includes('localhost')) {

        host = input[3].split('/')[0];
        uri = input[3].split('/')[1] || '';
      }

  } else if (input[2].toLowerCase().includes('www') || 
    input[2].toLowerCase().includes('localhost')) {
    method = 'GET';
    host = input[2].split('/')[0] || input[2];
    uri = input[2].split('/')[1] || '';
  
  } else {
    method = 'GET';
    process.stdin.write(howTo);
  } 
}

function setPort(current, index) {
  if (current.includes(':')) {
    PORT = current.slice(current.indexOf(':')+1, current.length);
    this[index] = current.slice(0, current.indexOf(':'));
  }
}

// generates the Request Header
function generateRequest(request, method) {
  let requestHeader = `${method} /${uri} HTTP/1.1
Host: ${host}:${PORT}
Connection: ${connection}
User-Agent: ${userAgent}
Accept: ${accept}

`;

  request.write(requestHeader, (err) => {
    if (err) throw err;
  });
}

// generates the Request Body
