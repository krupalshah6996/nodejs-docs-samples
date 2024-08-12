// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('node:assert/strict');
const cp = require('node:child_process');
const {existsSync, unlinkSync} = require('node:fs');

const {after, beforeEach, describe, it} = require('mocha');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});
const outputFile = 'output.mp3';

function removeOutput() {
  try {
    // Remove if outputFile exists
    unlinkSync(outputFile);
  } catch {
    // OK to ignore error if outputFile doesn't exist already
  }
}

describe('quickstart', () => {
  // Remove file if it already exists
  beforeEach(() => {
    removeOutput();
  });

  // Remove file after testing
  after(() => {
    removeOutput();
  });

  it('should synthesize speech to local mp3 file', () => {
    assert.equal(existsSync(outputFile), false);
    const stdout = execSync('node quickstart');
    assert.match(stdout, /Audio content written to file: output.mp3/);
    assert.ok(existsSync(outputFile));
  });
});
