require.extensions['.scss'] = function (module, filename) {
  return module._compile(`
var sassTrue = require('sass-true');
sassTrue.runSass({ file: '${filename}' }, describe, it);
  `, filename);
}