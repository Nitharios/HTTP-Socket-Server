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
  let type = requestInfo.type;
  let server = requestInfo.server;
  let date = requestInfo.date;
  let content_type = requestInfo.content_type;
  let connection = requestInfo.connection;

  // file reader with information formatter inside ASYNC function
  // this is the error or bad link catch
  if (!files.hasOwnProperty(uri)) {
    fs.readFile(`./source/error.html`, (err, data) => {
      if (method === 'GET') { 
        request.write(`${serverName}${uri} 404 NOT FOUND \n${server} \n${date} \n${content_type} \nContent-Length: ${data.length} \n${connection} \n\n${data} \n`, (err) => {
          if (err) throw err;
          request.end();
        });
      }     
    });

  } else { 
    fs.readFile(`./source${uri}`, (err, data) => {
      if (method === 'GET') {
        request.write(`${serverName}${uri} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: ${data.length} \n${connection} \n\n${data} \n`, (err) => {
          if (err) throw err;
          request.end();
        });
      }
    });
  }
  // ends connection after information has been sent to client
}

// returns Method and URI as strings in an object
function getRequestInfo(data) {
  let tempData = data.split('\r\n');
  let connection = tempData[tempData.length-3];
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
    server : 'Server: nginx/1.4.6 (Ubuntu)',
    date : timeStamp,
    content_type : 'text/html; charset=utf-8',
    connection : connection
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