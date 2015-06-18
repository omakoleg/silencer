# Silencer
Npm package to mock methods in object and capture all call parameters

# Install

```
npm install silencer --save-dev
```

# Api
- `reset` - completly reset silencer to original state
- `restore` - restore mocked methods but keep output traces for each methods. Use it immediately after mocking to restore functions and then analyse results
- `off` alias for restore
- `on(subject)` - set parameter as subject and disable all methods
- `disable()`, `disable('one', 'two')`, `disable(['one','two'])` - disable one or all methods 
- `setSubject` - set subject to be mocked, by default it is console.
- `getOutput(method)` - get traces for specified method
- `getOutpus` - get traces for all methods as object with name-array values

# Usage

```
var silencer =  require('silencer');
```

### Disable console log outputs
```
silencer.reset();
silencer.disable('log');
console.log('one');
console.log('two');
silencer.restore(); // restore methods, keep traces
silencer.getOutput('log') // == [['one'], ['two']]
```
### Disable all console methods
```
silencer.reset();
silencer.disable();
console.log('one');
console.info('three');
silencer.restore();
silencer.getOutput('log') // == [['one']]
silencer.getOutput('info') // == [['three']]
```
### Use for mocking other objects
```
let mockObject = {
	test: function(){ throw Error('service not available') }
}
silencer.reset();
silencer.setSubject(mockObject);
silencer.disable();
mockObject.test(); // no error thrown
silencer.restore();
//
silencer.getOutput('test'); // == [[]] mean called once without parameters
```

### On off
```
silencer.on(console);
// use 
console.log('one');
console.info('three');
// off
silencer.off();
// get results if needed
silencer.getOutput('log') // == [['one']]
silencer.getOutput('info') // == [['three']]
```

# Licence

MIT, Do whatever you want