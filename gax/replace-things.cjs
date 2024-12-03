const fs = require('fs');
const path = require('path');

function main(fileNames) {
  for (const file of fileNames) {
    const filePath = path.join(__dirname, file);
    let contents = fs.readFileSync(filePath, 'utf8');
    contents = contents.replace(
      /import \* as \$protobuf from "protobufjs\/minimal(\.js)?";/,
      'import $protobuf from "protobufjs/minimal.js";'
    );
    fs.writeFileSync(filePath, contents);
  }
}

main(process.argv.slice(2));
