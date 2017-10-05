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
let http = 'HTTP/1.1';
let PORT = process.env.PORT || 8080;
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
  // handle the case where the HTTP response results in a sever error
  generateErrorMessage(500);
  request.end();
});

request.on('end', () => {
  console.log('\nDisconnected from server');
});

// reads in data sent from server
request.on('data', (data) => {
  let serverReply = data.toString();

  if (!serverReply.toLowerCase().includes('content-type: text/html; charset=utf-8') ||
    !serverReply.toLowerCase().includes('<html')) {
    console.log('here');
    generateErrorMessage(500);
    request.end();
  
  } else if (method === 'GET') {
    serverReply = serverReply
    .slice(serverReply
    .indexOf('\n\n')+1, serverReply.length-1)
    .trim();
  
  } else {
    // sets a timeout to end the connection after 2 seconds
    // handles the case where the host cannot be reached
    setTimeout(function() {
      generateErrorMessage(504);
      request.end();
    }, 2000);
  }

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

// Sets the port if the user defines one
function setPort(current, index) {
  if (current.includes(':')) {
    PORT = current.slice(current.indexOf(':')+1, current.length);
    this[index] = current.slice(0, current.indexOf(':'));
  }
}

// generates the Request Header
function generateRequest(request, method) {
  let requestHeader = `${method} /${uri} ${http}
Host: ${host}:${PORT}
Connection: ${connection}
User-Agent: ${userAgent}
Accept: ${accept}

`;

  if (requestHeader.includes('undefined')) {
    // handles the case where the HTTP request is a client error
    generateErrorMessage(400);
    request.end();

  } else { 
    request.write(requestHeader, (err) => {
    if (err) throw err;
    });
  }
}

// generates the Request Body

// generates error codes and responses
function generateErrorMessage(errorCode) {
  let statusHandlers = {
    '400' : `\nERROR 400 Bad Request\n`,
    '404' : `\nERROR 404 ${host} cannot be reached!\n`,
    '414' : `\nERROR 414 ${host}/${uri} has exceeded the character limit\n`,
    '418' : `\nI'm a teapot!\n`,
    '500' : `\nERROR 500 Internal Service Error\n`,
    '504' : `\nERROR 504 Network connection has timed out\n`,
    '505' : `\nERROR 505 HTTP version is not supported\n`
  };

  if (statusHandlers.hasOwnProperty(errorCode)) process.stdout.write(statusHandlers[errorCode]);
  else process.stdout.write('Unknown Error shrugs.jpeg\n');
}