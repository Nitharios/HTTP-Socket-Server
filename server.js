// jshint esversion:6

const sanity = "You're not crazy!";
console.log('1st:', sanity);

///// ACTUAL CODE /////

const http = require('http');
const PORT = process.env.PORT || 8080;

const server = http.createServer((request, res) => {
  // client = setEncoding('utf8');
  // sent twice?? two requests???
  console.log('HTTP:', sanity);
  res.writeHead(200, {"Content-Type" : "text/HTML"});
  res.write(`${sanity} \r\n`);
  res.end();

});

server.on('error', (err) => {
  throw err;
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

