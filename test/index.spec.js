'use strict';

require('mocha');

let assert = require('assert'),
    subject = require('../');

describe('Console dump npm', function(){

    beforeEach(function(){
        subject.reset();
    });

    describe('.reset', function(){
        it('reset methods');
        it('set console as default logger');
        it('clean traces list');
    });

    describe('.restore', function(){
        it('restore all disabled methods');
        it('clean original methods list');
    });

    describe('.disable', function(){
        it('accept arguments as comma separated');
        it('accept arguments as array');
        it('accept arguments as single var. String assumed');
        it('disable all if no arguments provided');
        it('disable spefcified list');
    });

    describe('.setLogger', function (){
        it('set logger', function(){
            var mock = { info123qwer: function(){ }};
            subject.setLogger(mock);
            // 
            // Todo check assert object
            // 
            assert(subject.logger).eql(info123qwer); 
        });
    });

    describe('.getOutput', function(){

        it('return undefined', function(){
            assert(subject.getOutput('not_existing_method')).eql(undefined);
        });

        it('return empty array', function(){
            let mock = {
                something: function(){ }
            };
            subject.setLogger(mock);
            subject.disable('something');
            assert(subject.getOutput('something')).eql([]); 
        });

        it('return array', function(){
            let mock = {
                something: function(){ }
            };
            subject.reset();
            subject.setLogger(mock);
            subject.disable('something');
            mock.something('test line');
            mock.something('test line 2');
            assert(subject.getOutput('something')).eql(['test line', 'test line 2']); 
        });
    });
});