var os = require('os');

var MuninClient = module.exports = function(node, conn){
    this.node = node;
    this.conn = conn;
    this.cmdtbl = {
        'cap' : cmd_cap,
        'list' : cmd_list,
        'nodes' : cmd_nodes,
        'config' : cmd_config,
        'fetch' : cmd_fetch,
        'version' : cmd_version,
        'quit' : cmd_quit,
        'unknown' : cmd_unknown,
    };
}
MuninClient.prototype.dispatch = function(data){
    var self = this;
    data.split('\n').
        filter(function(v){ return v !== '' }).
        map(function(v){ return v.split(' ') }).
        forEach(function(v){
            var cmd = v.shift();
            if( cmd in self.cmdtbl ){
                self.cmdtbl[cmd](self, v);
            }else{
                self.cmdtbl['unknown'](self, v);
            }
        })
}
MuninClient.prototype.onConnected = function(){
    this.conn.setEncoding("utf8");
    var msg = '# munin node at ' + os.hostname() + '\n';
    this.conn.write(msg);
}
MuninClient.prototype.onRecved = function(data){
    console.log('server-> ' + data + ' from ' + this.conn.remoteAddress + ':' + this.conn.remotePort);
    this.dispatch(data);
}
MuninClient.prototype.onClosed = function(){
    console.log('server-> client closed connection');
}


var cmd_unknown = function(cl, args){
    var msg = '# Unknown command. Try cap, list, nodes, config, fetch, version or quit' + '\n'
    cl.conn.write(msg);
}
var cmd_cap = function(cl, args){
    var msg = "cap multigraph dirtyconfig" + '\n'
    cl.conn.write(msg);
}
var cmd_list = function(cl, args){
    var msg = cl.node.services.map(function(v){ return v.name() }).join(' ') + '\n';
    cl.conn.write(msg);
}
var cmd_nodes = function(cl, args){
    var msg = [ os.hostname() ].join("\n") + '.' + '\n'
    cl.conn.write(msg);
}
var cmd_config = function(cl, args){
    var msg = "";
    if(args.length === 0){
        msg = "# Unknown service" + '\n'
        return cl.conn.write(msg);
    }
    var service = args[0];
    var w = cl.node.services.filter(function(v){ return v.name() === service })
    if(w.length === 0){
        msg = "# Unknown service" + '\n'
        return cl.conn.write(msg);
    }
    msg = w[0].config() + "\n.\n"
    cl.conn.write(msg);
}
var cmd_fetch = function(cl, args){
    if(args.length === 0){
        msg = "# Unknown service" + '\n'
        return cl.conn.write(msg);
    }
    var service = args[0];
    var w = cl.node.services.filter(function(v){ return v.name() === service })
    if(w.length === 0){
        msg = "# Unknown service" + '\n'
        return cl.conn.write(msg);
    }
    msg = w[0].fetch() + "\n.\n"
    cl.conn.write(msg);
}
var cmd_version = function(cl, args){
    var msg = "munins node on " + os.hostname() + " version: " + cl.node.version + '\n'
    cl.conn.write(msg);
}
var cmd_quit = function(cl, args){
    cl.conn.end();
}

