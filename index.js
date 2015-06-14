'use strict';

let self = {
        traces: {},
        originalMethods: {},
        subject: console
    };

self.forOwnFunctions = function(obj, cb){
    for(var x in obj) {
        if(obj.hasOwnProperty(x) && typeof obj[x] === 'function') {
            cb(x, obj[x]);
        }
    }
}

self.disableAll = function() {
    self.forOwnFunctions(self.subject, function(key, value){
        self.disableMethod(key);
    });
}

self.disableMethod = function(method){
    if(self.originalMethods[method] !== undefined){
        throw new Error('Trying to redifine already redefined method');
    }
    if(!self.subject.hasOwnProperty(method)) {
        throw new Error('Trying to redefine undefined method in subject');
    }
    // save original 
    self.originalMethods[method] = self.subject[method];
    // reset previous results
    self.traces[method] = [];
    // new handler
    self.subject[method] = function(){
        self.traces[method].push(Array.prototype.slice.call(arguments));
    }
}
/*
    Public API
 */
self.reset = function(){
    self.restore();
    self.setSubject(console);
    self.traces = {};
}

self.restore = function(){
    self.forOwnFunctions(self.originalMethods, function(key, value){
        self.subject[key] = value;
    });
    self.originalMethods = {}; // reset 
}

self.disable = function(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length === 1) {
        if(typeof args[0] === 'object') {
            args = args[0];
        } else {
            args = [args.toString()];
        }
    }
    if(!args || args.length === 0){
        // iterate all methods
        self.disableAll();
    } else {
        // disable by arguments list
        args.forEach(function(item){
            self.disableMethod(item);
        });
    }
}

self.setSubject = function(subjectLocal) {
    self.subject = subjectLocal;
}

self.getOutput = function(method) {
    return self.traces[method];
}

self.getOutputs = function() {
    return self.traces;
}

module.exports = self;
