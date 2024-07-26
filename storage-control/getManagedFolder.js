// Copyright 2024 Google LLC
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

function main(bucketName, managedFolderName) {
  // [START storage_control_managed_folder_get]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */

  // The name of your GCS bucket
  // const bucketName = 'bucketName';

  // The name of the managed folder to get
  // const managedFolderName = 'managedFolderName';

  // Imports the Control library
  const {StorageControlClient} = require('@google-cloud/storage-control').v2;

  // Instantiates a client
  const controlClient = new StorageControlClient();

  async function callGetManagedFolder() {
    const managedFolderPath = controlClient.managedFolderPath(
      '_',
      bucketName,
      managedFolderName
    );

    // Create the request
    const request = {
      name: managedFolderPath,
    };

    // Run request
    const [response] = await controlClient.getManagedFolder(request);
    console.log(`Got managed folder: ${response.name}.`);
  }

  callGetManagedFolder();
  // [END storage_control_managed_folder_get]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
