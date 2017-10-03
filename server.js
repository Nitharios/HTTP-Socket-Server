// jshint esversion:6

const sanity = "You're not crazy!";
console.log('1st:', sanity);

const timeStamp = new Date();

let requestData = [];

///// ACTUAL CODE /////

const net = require('net');
const fs = require('fs');
const staticData = require('./static-data');
// const http = require('http');
const serverName = 'https://www.ihateNET.com';
const PORT = process.env.PORT || 8080;

const server = net.createServer((request) => {
  request.setEncoding('utf8');

  console.log('2nd:', sanity);

  request.on('data', (data) => {
    console.log('emitted:\n', data);
    formatData(data);
    getRequestInfo(data);
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

///// FUNCTIONS /////

// the LONG ASS IF FUNCTION
function generateResponse(data) {
  let requestInfo = getRequestInfo(data);
  let method = requestInfo.method;
  let uri = requestInfo.uri;

  if (method === 'GET') {
    if (uri === '/index.html') {

    } else if (uri === '/helium.html') {

    } else if (uri === '/hydrogen.html') {

    } else if (uri === '/styles.css') {

    } else {

    }
  }
}

// returns Method and URI as strings in an object
function getRequestInfo(data) {
  let tempData = data.split('\r\n');
  let methodLine = tempData[0];
  methodLine = methodLine.split(' ');
  let method = methodLine[0];
  let uri = methodLine[1];
  let type = methodLine[2];

  return {
    method : method,
    uri : uri,
    type : type
  };
}

function formatData(data) {
  let tempData = data.split('\r\n');
  // console.log(tempData);
  let header = 
    `${tempData[0]}\n${tempData[5]}\nTime Stamp: ${timeStamp}\n${serverName}`;
  console.log(header);
  // time = moment(time).format('MMMM Do YYYY, h:mm:ss a');
}

///// SCRATCH /////

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