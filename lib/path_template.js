/**
 * Path template utility.
 */

var Parser = require("jison").Parser;

var grammar = {
  "lex": {
    "rules": [
      ["[0-9]+", "return 'NUMBER';"]
    ]
  },
  "bnf": {
    "expressions": [["NUMBER", "return Number(yytext);"]]
  }
};

var parser = new Parser(grammar);

exports.instantiate = function(data) {
  return parser.parse(data);
};
