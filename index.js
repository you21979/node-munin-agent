var MuninNode = exports.MuninNode = require('./lib/munin_node');
var MuninClient = exports.MuninClient = require('./lib/munin_client');
var MuninService = exports.MuninService = require('./lib/munin_service');
var MuninPlugin = exports.plugin = require('munin-plugin');
var createMuninNode = exports.createMuninNode = function(port){
    return new MuninNode(port);
}
