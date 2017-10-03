/*jshint esversion:6*/
let sanity = "You're not crazy!";
console.log(sanity);

const net = require('net');
const PORT = process.env.PORT || 8080;
let url = process.argv[2].split('/')[0];
let uri = process.argv[2].split('/')[1];

const request = new net.connect(PORT, () => {
  console.log(`Connected to server at port ${PORT}`);
  console.log(process.argv);

  console.log(url);
  console.log(uri);

  process.stdin.pipe(request);

  request.pipe(process.stdout);

  request.end();
});

request.on('error', (err) => {
  throw err;
});

request.on('end', () => {
  console.log('Disconnected from server');
});