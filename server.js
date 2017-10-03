// jshint esversion:6

const sanity = "You're not crazy!";
console.log('1st:', sanity);

///// ACTUAL CODE /////

const net = require('net');
const fs = require('fs');

const serverName = 'https://www.ihateNET.com';
const PORT = process.env.PORT || 8080;
const timeStamp = new Date();

let requestData = [];

const server = net.createServer((request) => {
  request.setEncoding('utf8');

  console.log('2nd:', sanity);

  request.on('data', (data) => {
    // console.log('emitted:\n', data);
    generateResponse(data);
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
  let type = requestInfo.type;
  let server = requestInfo.server;
  let date = requestInfo.date;
  let content_type = requestInfo.content_type;
  let connection = requestInfo.connection;

  if (method === 'GET') {
    if (uri === '/' || uri === '/index.html') {
      console.log(`${type} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: ${staticData.index_html.length} \n${connection}`);
    } else if (uri === '/helium.html') {
      console.log(`${type} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: ${staticData.helium_html.length} \n${connection}`);
    } else if (uri === '/hydrogen.html') {
      console.log(`${type} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: ${staticData.hydrogen_html.length} \n${connection}`);
    } else if (uri === '/styles.css') {
      console.log(`${type} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: ${staticData.styles_css.length} \n${connection}`);
    } else {
      console.log(`${type} 404 NOT FOUND \n${server} \n${date} \n${content_type} \nContent-Length: ${staticData.error_html.length} \n${connection}`);
    }
  }
}

// returns Method and URI as strings in an object
function getRequestInfo(data) {
  let tempData = data.split('\r\n');
  console.log('crazy', tempData);
  let connection = tempData[tempData.length-3];
  let methodLine = tempData[0];
  methodLine = methodLine.split(' ');
  let method = methodLine[0];
  let uri = methodLine[1];
  let type = methodLine[2];

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