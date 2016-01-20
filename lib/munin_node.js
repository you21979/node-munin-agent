var net = require('net');
var MuninClient = require('./munin_client');

var MuninNode = module.exports = function(port){
    var self = this;
    this.clients = [];
    this.services = [];
    this.version = "1.4.6";
    this.server = net.createServer(function(conn){
        var cl = new MuninClient(self, conn);
        self.addClient(cl);
        conn.on('data', function(data){
            cl.onRecved(data);
        });
        conn.on('close', function(){
            self.removeClient(cl);
            cl.onClosed();
        });
        cl.onConnected();
    }).listen(port, '0.0.0.0');
}

MuninNode.prototype.addClient = function(cl){
    this.clients.push(cl);
}
MuninNode.prototype.removeClient = function(cl){
    this.clients = this.clients.filter(function(v){ return cl !== v });
}
MuninNode.prototype.addService = function(service){
    this.services.push(service);
}
MuninNode.prototype.removeService = function(service){
    this.services = this.services.filter(function(v){ return service !== v });
}

