// jshint esversion:6
const sanity = "You're not crazy!";
console.log(sanity);

/* ACTUAL CODE */

// stuff required to run the stuff we want
const net = require('net');
const fs = require('fs');
// const path = require('path');

// set this stuff now so it's easier to use later
const serverName = 'https://www.ihateNET.com';
const PORT = process.env.PORT || 8080;
const timeStamp = new Date();
const files = {
  '/index.html' : '/index.html',
  '/helium.html' : '/helium.html',
  '/hydrogen.html' : '/hydrogen.html',
  '/styles.css' : '/styles.css'
};

// create the server which handles connection requests
const server = net.createServer((request) => {
  request.setEncoding('utf8');

  request.on('data', (data) => {
    console.log('Client has connected!');
    // console.log(data);
    generateResponse(request, data);
  });
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

/* FUNCTIONS */

// does stuff...
function generateResponse(request, data) {
  let requestInfo = getRequestInfo(data);
  let method = requestInfo.method;
  let uri = requestInfo.uri;

  // file reader with information formatter inside ASYNC function
  if (files.hasOwnProperty(uri)) {
    fs.readFile(`./source${uri}`, 'utf8', (err, data) => {
      if (err) throw err;

      if (method === 'GET' || method === 'HEAD') {
        request.write(formatInfo(requestInfo, uri, data, true), (err) => {
          if (err) throw err;

          request.end();
        });
      }
    });

  } else { 
    fs.readFile(`./source/error.html`, 'utf8', (err, data) => {
      if (err) throw err;

      request.write(formatInfo(requestInfo, uri, data, false), (err) => {
        if (err) throw err;

        request.end();
      });  
    });
  }
}

// blah blah
function formatInfo(info, uri, data, validRequest) {
  let method = info.method;
  let type = info.type;
  let server = info.server;
  let date = info.date;
  let content_type = info.content_type;
  let connection = info.connection;

  if (validRequest) {
   
   if (method === 'HEAD') return `${type} 200 OK\nServer: ${server}\nDate: ${timeStamp}\nContent-Type: ${content_type}\nContent-Length: ${data.length}\nConnection: ${connection}\n\n${data}`;

   else if (method === 'GET') return `${type} 200 OK\nServer: ${server}\nDate: ${timeStamp}\nContent-Type: ${content_type}\nContent-Length: ${data.length}\nConnection: ${connection}\n\n${data}`;
  
  } else return `${type} 404 NOT FOUND\nServer: ${server}\nDate: ${timeStamp}\nContent-Type: ${content_type}\nContent-Length: ${data.length}\nConnection: ${connection}\n\n${data}`;
}

// returns Method and URI as strings in an object
function getRequestInfo(data) {
  let tempData = data.split('\r\n');
  let methodLine = tempData[0].split(' ');
  let method = methodLine[0];
  let uri = methodLine[1];
  let type = methodLine[2];

  // handles any pesky links ending with 'l'
  if (uri === '/') uri = '/index.html';
  else if (uri[uri.length-1] === '/') uri = uri.slice(0, (uri.length-1));

  return {
    method : method,
    uri : uri,
    type : type,
    server : 'nginx/1.4.6 (Ubuntu)',
    date : timeStamp,
    content_type : 'text/html; charset=utf-8',
    connection : 'keep-alive'
  };
}

/* SCRATCH */

// function formatData(data) {
//   let tempData = data.split('\r\n');
//   // console.log(tempData);
//   let header = 
//     `${tempData[0]}\n${tempData[5]}\nTime Stamp: ${timeStamp}\n${serverName}`;
//   console.log(header);
//   // time = moment(time).format('MMMM Do YYYY, h:mm:ss a');
// }

// const server = http.createServer((request, response) => {
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