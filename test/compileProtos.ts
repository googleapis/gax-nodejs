import {expect} from 'chai';
import * as assert from 'assert';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as util from 'util';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as compileProtos from '../tools/compileProtos';

const readFile = util.promisify(fs.readFile);
const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);

const testDir = path.join(process.cwd(), '.compileProtos-test');
const resultDir = path.join(testDir, 'protos');
const cwd = process.cwd();

describe('compileProtos tool', () => {
  before(async () => {
    if (fs.existsSync(testDir)) {
      await rmrf(testDir);
    }
    await mkdir(testDir);
    await mkdir(resultDir);

    process.chdir(testDir);
  });

  after(() => {
    process.chdir(cwd);
  });

  it('compiles protos to JSON', async () => {
    await compileProtos.main([
      path.join(__dirname, '..', '..', 'test', 'fixtures', 'protoLists'),
    ]);
    const expectedResultFile = path.join(resultDir, 'protos.json');
    assert(fs.existsSync(expectedResultFile));
    console.log(expectedResultFile);

    const json = await readFile(expectedResultFile);
    const root = protobuf.Root.fromJSON(JSON.parse(json.toString()));

    assert(root.lookup('TestMessage'));
    assert(root.lookup('LibraryService'));
  });
});
