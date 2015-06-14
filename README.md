# Silencer
Npm package to mock methods in object and capture all call parameters

# Install

```
npm install silencer --save-dev
```

# Api
- `reset` - completly reset silencer to original state
- `restore` - restore mocked methods but keep output traces for each methods. Use it immediately after mocking to restore functions and then analyse results
- `disable()`, `disable('one', 'two')`, `disable(['one','two'])` - disable one or all methods 
- `setSubject` - set subject to be mocked, by default it is console.
- `getOutput(method)` - get traces for specified method
- `getOutpus` - get traces for all methods as object with name-array values

# Usage

### Disable console log outputs
```
subject.reset();
subject.disable('log');
console.log('one');
console.log('two');
subject.restore(); // restore methods, keep traces
subject.getOutput('log') // == [['one'], ['two']]
```
### Disable all console methods
```
subject.reset();
subject.disable();
console.log('one');
console.info('three');
subject.restore();
subject.getOutput('log') // == [['one']]
subject.getOutput('info') // == [['three']]
```
### Use for mocking other objects
```
let mockObject = {
	test: function(){ throw Error('service not available') }
}
subject.reset();
subject.setSubject(mockObject);
subject.disable();
mockObject.test(); // no error thrown
subject.restore();
//
subject.getOutput('test'); // == [[]] mean called once without parameters
```

# Licence

MIT, Do whatever you want