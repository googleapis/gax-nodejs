const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const NODE_VERSION = '18';
const PREV_NODE_VERSION = '14';
async function main() {
  // Grab package.json
  const jsonPath = path.join(__dirname, 'package.json').toString();
  let packageJson = fs.readFileSync(jsonPath, 'utf8');
  packageJson = JSON.parse(packageJson);

  console.log('updating engines field...');
  packageJson.engines.node = `>=${NODE_VERSION}`;
  fs.writeFileSync(jsonPath, JSON.stringify(packageJson, null, 2));

  console.log('updating all dependencies to latest');
  if (packageJson.dependencies) {
    for (const dep of Object.keys(packageJson.dependencies)) {
      console.log(`npm i ${dep}@latest --engines-strict`);
      execSync(`npm i ${dep}@latest --engines-strict`);
    }
  }
  if (packageJson.devDependencies) {
    for (const dep of Object.keys(packageJson.devDependencies)) {
      console.log(`npm i ${dep}@latest -D --engines-strict`);
      execSync(`npm i ${dep}@latest -D --engines-strict`);
    }
  }

  let samplesPackageJson;
  let samplesJsonPath;
  try {
    samplesJsonPath = path
      .join(__dirname, 'samples', 'package.json')
      .toString();
    samplesPackageJson = fs.readFileSync(samplesJsonPath, 'utf8');
    samplesPackageJson = JSON.parse(samplesPackageJson);
  } catch (err) {
    console.log(
      'Repo does not have a samples directory; skipping updating samples'
    );
  }

  if (samplesPackageJson) {
    // Update engines field
    console.log('updating samples engines field...');
    samplesPackageJson.engines.node = `>=${NODE_VERSION}`;
    fs.writeFileSync(
      samplesJsonPath,
      JSON.stringify(samplesPackageJson, null, 2)
    );
  }

  execSync(
    `rm -rf .kokoro/continuous/node${PREV_NODE_VERSION} .kokoro/presubmit/node${PREV_NODE_VERSION}`
  );
  execSync('npm login --registry https://wombat-dressing-room.appspot.com');
  execSync(
    `npm dist-tag add ${packageJson.name}@${packageJson.version} legacy-${PREV_NODE_VERSION} --registry=https://wombat-dressing-room.appspot.com/`
  );
}

main();