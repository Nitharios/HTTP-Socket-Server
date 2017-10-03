/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const PORT = process.env.PORT || 8080;

const request = new net.connect(PORT, () => {
  console.log(`Connected to server at port ${PORT}`);
});

request.on('error', (err) => {
  throw err;
});

request.on('end', () => {
  console.log('Disconnected from server');
});