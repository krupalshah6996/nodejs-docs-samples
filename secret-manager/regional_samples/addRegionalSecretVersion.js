// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

async function main(projectId, locationId, secretId) {
  // [START secretmanager_add_regional_secret_version]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const projectId = 'my-project';
  // const locationId = 'location';
  // const secretId = 'my-secret';

  const parent = `projects/${projectId}/locations/${locationId}/secrets/${secretId}`;
  // Imports the Secret Manager library
  const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

  // Adding the endpoint to call the regional secret manager sever
  const options = {};
  options.apiEndpoint = `secretmanager.${locationId}.rep.googleapis.com`;

  // Instantiates a client
  const client = new SecretManagerServiceClient(options);

  // Payload is the plaintext data to store in the secret
  const payload = Buffer.from('my super secret data', 'utf8');

  async function addRegionalSecretVersion() {
    const [version] = await client.addSecretVersion({
      parent: parent,
      payload: {
        data: payload,
      },
    });

    console.log(`Added regional secret version ${version.name}`);
  }

  addRegionalSecretVersion();
  // [END secretmanager_add_regional_secret_version]
}

const args = process.argv.slice(2);
main(...args).catch(console.error);
