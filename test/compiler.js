require.extensions['.scss'] = function (module, filename) {
  return module._compile(`
var sassTrue = require('sass-true');
try {
  sassTrue.runSass({ file: '${filename}', sass: require('sass')}, describe, it);
} catch (e) {
  console.log('Compilation failed');
  console.log(e.formatted);
  throw e;
};
    `, filename);

}