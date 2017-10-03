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
let files = {
  index_html : '/index.html',
  helium_html : '/helium.html',
  hydrogen_html : '/hydrogen.html',
  styles_css : '/styles.css'
};

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

// will generate the response text
function generateResponse(data) {
  let requestInfo = getRequestInfo(data);
  let method = requestInfo.method;
  let uri = requestInfo.uri;
  let type = requestInfo.type;
  let server = requestInfo.server;
  let date = requestInfo.date;
  let content_type = requestInfo.content_type;
  let connection = requestInfo.connection;
  let info;

  if (method === 'GET') {
    for (let path in files) {
      if (uri === files[path]) {
        // readFileData(uri, (err, data) => {
        //   if (err) return err;
        //   else return data;

        // });
        info = readFileData(uri);
        return console.log(`${type} 200 OK \n${server} \n${date} \n${content_type} \nContent-Length: \n${connection} \n\n${info}`);

      } else {
        info = readFileData('/error.html');
        return console.log(`${type} 404 NOT FOUND \n${server} \n${date} \n${content_type} \nContent-Length: \n${connection} \n\n${info}`);        
      }
    }
  }
}

// file reader
function readFileData(uri) {
  // return fs.readFile(`./source${uri}`, (err, data) => {
  //     if (err) throw err;
  //     else return data;
  // });

  // fs.readFile(`./source${uri}`, (err, data) => {
  //   if (err) cb(err, null);
  //   else cb(null, data);
  // });

  let readableData = fs.readFileSync(`./source${uri}`, (err, data) => {
    if (err) throw err;
  });

  // console.log(readableData.toString());
  return readableData.toString();
}

// returns Method and URI as strings in an object
function getRequestInfo(data) {
  let tempData = data.split('\r\n');
  // console.log('crazy', tempData);
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



///// SCRATCH /////

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