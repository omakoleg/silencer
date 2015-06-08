'use strict';

let _ = require('lodash'),
    object = {
        traces: {},
        originalMethods: {},
        logger: console
    };

function disableAll() {
    _.forOwn(object.logger, function(value, key){
        if(typeof object.logger[key] === 'function') {
            object.disableMethod(key);
        }
    });
}

function disableMethod(method){
    if(object.originalMethods[method] !== undefined){
        throw new Error('Trying to redifine already redefined method');
    }
    if(!object.logger.hasOwnProperty(method)) {
        throw new Error('Trying to redefine undefined method in logger');
    }
    // save original 
    object.originalMethods[method] = object.logger[method];
    // reset previous results
    object.traces[method] = [];
    // new handler
    object.logger[method] = function(){
        object.traces[method].push(Array.prototype.slice.call(arguments));
    }
}
/*
    Public API
 */
object.reset = function(){
    object.restore();
    object.setLoger(console);
    object.traces = [];
}

object.restore = function(){
    _.forOwn(object.originalMethods, function(value, key){
        object.logger[key] = value;
    });
    object.originalMethods = {}; // reset 
}

object.disable = function(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length === 1) {
        if(typeof args[0] === 'array') {
            args = args[0];
        } else {
            args = [args.toString()];
        }
    }
    if(!args || args.length === 0){
        // iterate all methods
        object.disableAll();
    } else {
        // disable by arguments list
        args.forEach(function(item){
            object.disableMethod(item);
        });
    }
}

object.setLoger = function(loggerLocal) {
    object.logger = loggerLocal;
}

object.getOutput = function(method) {
    return object.logger[method];
}

module.exports = object;
