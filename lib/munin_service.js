var MuninService = module.exports = function(){
}

MuninService.prototype.task = function(){
    throw new Error('please override this method');
}
MuninService.prototype.parse = function(){
    var r = {
        values : [],
        fields : [],
    };
    var graph = this.task();
    var label = graph.list.getMuninValues();
    var field = graph.list.getMuninParams();

    for(var key in label){
        r.values.push(key + ' ' + label[key])
    }
    field.forEach(function(v){
        for(var name in v){
            var label = v.label.replace(/ |\./g, '_');
            r.fields.push(label + '.' + name + ' ' + v[name]);
        }
    });
    return r
}
MuninService.prototype.fetch = function(){
    return this.parse().values.join('\n');
}
MuninService.prototype.config = function(){
    return this.parse().fields.join('\n');
}
MuninService.prototype.name = function(){
    var graph = this.task();
    return graph.getMultiGraph().replace(/ |\./g, '_')
}
