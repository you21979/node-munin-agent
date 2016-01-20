var net = require('net');

var PORT = '4949';
var HOST = 'localhost';

var client = new net.Socket();
client.setEncoding('utf8');

client.connect(PORT, HOST, function(){
    console.log('client-> connected');
});

process.stdin.resume();

process.stdin.on('data', function(data){
    client.write(data);
});

client.on('data', function(data){
    console.log('client-> \n' + data + '\n');
});

client.on('close', function(){
    console.log('client-> closed');
});
