'use strict';

var _root = null;
var path = require('path');
var fs   = require('fs');

module.exports = function (abspath) {
  if (_root) return require(_root + abspath);
  var stack = new Error().stack;
  var relevantLine = stack.split('\n')[2];
  var matched = / \((.+)\:\d+\:\d+\)$/.exec(relevantLine);
  var callerFile = matched[1];
  var current = path.dirname(callerFile);
  while (1) {
    if (fs.existsSync(current + '/package.json')) {
      break;
    }
    if (current === '/') {
      throw new Error('node-self: ' + callerFile + ' is not part of a node package.');
    }
    current = path.resolve(current, '../');
  }

  _root = current + '/';
  return require(_root + abspath);
};
