'use strict';

require('mocha');

let assert = require('assert'),
    subject = require('../');

describe('Npm package Silencer', function(){

    beforeEach(function(){
        subject.reset();
    });

    describe('.reset', function(){
        it('reset methods', function(){
            let mock = {
                something: function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable('something');
            assert.equal(mock.something(10), undefined);
            subject.reset();
            assert.equal(mock.something(11), 11);
        });

        it('set console as default logger', function(){
            subject.reset();
            assert.deepEqual(subject.subject, console);
        });

        it('clean traces list', function(){
            subject.reset();
            assert.deepEqual(subject.traces, {});
        });
    });

    describe('.restore', function(){
        it('alias .off', function(){
            let mock = {
                something: function(param){ return param; }
            };
            subject.on(mock);
            subject.off();
            assert.deepEqual(subject.originalMethods, {});
        });

        it('restore all disabled methods', function(){
            let mock = {
                something: function(param){ return param; },
                otherone:  function(param){ return param; },
            };
            subject.setSubject(mock);
            subject.disable('something', 'otherone');
            assert.equal(mock.something(10), undefined);
            assert.equal(mock.otherone(10), undefined);
            subject.restore();
            assert.equal(mock.something(10), 10);
            assert.equal(mock.otherone(10), 10);
        });

        it('clean original methods list', function(){
            let mock = {
                something: function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable('something');
            subject.restore();
            assert.deepEqual(subject.originalMethods, {});
        });
    });

    describe('.disable', function(){
        it('accept arguments as comma separated', function(){
            let mock = {
                something:   function(param){ return param; },
                otherone:    function(param){ return param; },
                andanother:  function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable('something', 'otherone', 'andanother');
            assert.equal(mock.something(10), undefined);
            assert.equal(mock.otherone(10), undefined);
            assert.equal(mock.andanother(10), undefined);
        });

        it('accept arguments as array', function(){
            let mock = {
                something:   function(param){ return param; },
                otherone:    function(param){ return param; },
                andanother:  function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable(['something', 'otherone', 'andanother']);
            assert.equal(mock.something(10), undefined);
            assert.equal(mock.otherone(10), undefined);
            assert.equal(mock.andanother(10), undefined);
        });

        it('accept arguments as single var. String assumed', function(){
            let mock = {
                something:   function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable('something');
            assert.equal(mock.something(10), undefined);
        });

        it('disable all if no arguments provided', function(){
            let mock = {
                something:   function(param){ return param; },
                otherone:    function(param){ return param; },
                andanother:  function(param){ return param; }
            };
            subject.setSubject(mock);
            subject.disable();
            assert.equal(mock.something(10), undefined);
            assert.equal(mock.otherone(10), undefined);
            assert.equal(mock.andanother(10), undefined);
        });
    });

    describe('.setSubject', function (){
        it('set logger', function(){
            var mock = { info123qwer: function(){ }};
            subject.setSubject(mock);
            assert.deepEqual(subject.subject, mock);  // subject - private
        });
    });

    describe('.on', function (){
        it('set logger and disable all', function(){
            var mock = { info123qwer: function(v){ return v; }};
            subject.on(mock);
            assert.deepEqual(subject.subject, mock);  // subject - private
            assert.equal(mock.info123qwer(10), undefined);
        });
    });

    describe('.getOutput', function(){

        it('return undefined', function(){
            assert.equal(subject.getOutput('not_existing_method'), undefined);
        });

        it('return empty array', function(){
            let mock = {
                something: function(){ }
            };
            subject.setSubject(mock);
            subject.disable('something');
            assert.deepEqual(subject.getOutput('something'), []); 
        });

        it('return array', function(){
            let mock = {
                something: function(){ }
            };
            subject.reset();
            subject.setSubject(mock);
            subject.disable('something');
            mock.something('test line');
            mock.something('test line 2');
            assert.deepEqual(subject.getOutput('something'), [['test line'], ['test line 2']]); 
        });
    });

    describe('.getOutputs', function(){

        it('return empty object', function(){
            assert.deepEqual(subject.getOutputs(), {});
        });

        it('return array for specified disables', function(){
            let mock = {
                something: function(){ },
                moreone: function(){ },
                notdumped: function(){}
            };
            subject.reset();
            subject.setSubject(mock);
            subject.disable('something', 'moreone');
            mock.something('test line');
            mock.something('test line 2');
            mock.moreone('next one');
            mock.notdumped('i will not be there');
            assert.deepEqual(subject.getOutputs(), {
                something: [['test line'], ['test line 2'] ],
                moreone: [['next one']]
            }); 
        });
    });

    describe('examples', function(){
        it('disable console log', function(){
            subject.reset();
            // console set by default
            // subject.setSubject(console);
            subject.disable('log');

            console.log('one');
            console.log('two');

            subject.restore();

            assert.deepEqual(subject.getOutput('log'), [['one'], ['two']]);
        });

        it('disable all console methods', function(){
            subject.reset();
            // console set by default
            // subject.setSubject(console);
            subject.disable();
            console.info('three');
            subject.restore();

            assert.deepEqual(subject.getOutput('info'), [['three']]);
        });

        it('use as mocking object', function(){
            let mockObject = {
                test: function(){ throw Error('service not available') }
            }
            subject.reset();
            subject.setSubject(mockObject);
            subject.disable();

            mockObject.test(); // no error thrown

            subject.restore();

            assert.deepEqual(subject.getOutput('test'), [[]]); // array with empty array, called once
        });
    });
});