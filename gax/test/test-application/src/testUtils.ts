async function captureStderr(action: Function) {
  const oldStderrWrite = process.stderr.write;
  let output = '';
  process.stderr.write = (chunk) => {
    output += chunk.toString();
    return true; // Indicate success
  };

  try {
    await action();
  } finally {
    process.stderr.write = oldStderrWrite;
  }
  return output;
}
module.exports = { captureStderr };
