var util = require('util');
var muninAgent = require('..');

var Plugin = function(){ muninAgent.MuninService.call(this) }
util.inherits(Plugin, muninAgent.MuninService)

Plugin.prototype.task = function(){
    var g = new muninAgent.plugin.Graph('game object count','count','game');
    g.add(new muninAgent.plugin.Model.Default('player').setValue(100));
    g.add(new muninAgent.plugin.Model.Default('monster').setValue(256));
    g.add(new muninAgent.plugin.Model.Default('npc').setValue(5));
    return g;
}

var sv = muninAgent.createMuninNode(4949);
sv.addService(new Plugin());
