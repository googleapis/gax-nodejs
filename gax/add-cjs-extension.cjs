const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

function getAllFullFilePaths(dirname, filenames) {
  // const files = fs.readdirSync(dirPath);

  const arrayOfFiles = [];

  filenames.forEach(file => {
    arrayOfFiles.push(path.join(dirname, file));
  });

  return arrayOfFiles;
}

function main(directoryOrFilenames) {
  let fileNames;
  if (
    fs.statSync(path.join(__dirname, directoryOrFilenames[0])).isDirectory()
  ) {
    fileNames = getAllFiles(directoryOrFilenames[0]);
  } else {
    fileNames = getAllFullFilePaths(__dirname, directoryOrFilenames);
  }
  for (const file of fileNames) {
    let contents = fs.readFileSync(file, 'utf8');
    if (contents.includes('proxyquire')) {
      contents = contents.replace(/\.js'/g, ".cjs'");
      fs.writeFileSync(file, contents);
    }
  }
}

main(process.argv.slice(2));
