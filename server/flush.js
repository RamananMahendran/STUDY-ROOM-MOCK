const net = require('net');
const client = new net.Socket();

client.connect(6379, '127.0.0.1', () => {
  console.log('Connected to Redis');
  client.write('FLUSHALL\r\n');
});

client.on('data', (data) => {
  console.log('Received from Redis: ' + data);
  client.destroy(); // kill client after server's response
});

client.on('close', () => {
  console.log('Connection closed');
});
