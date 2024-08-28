/**
 * Copyright 2024 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const main = (projectId = process.env.GOOGLE_CLOUD_PROJECT) => {
  // [START antimoneylaunderingai_list_locations]
  // Import google-auth-library for authentication.
  const {GoogleAuth} = require('google-auth-library');

  const listLocations = async () => {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    });
    // TODO(developer): uncomment these lines before running the sample
    // const projectId = 'my-project-id';
    const url = `https://financialservices.googleapis.com/v1/projects/${projectId}/locations`;
    const client = await auth.getClient();
    const response = await client.request({url, method: 'GET'});
    console.log(JSON.stringify(response.data));
  };

  listLocations();
  // [END antimoneylaunderingai_list_locations]
};

// node listLocations.js <projectId>
main(...process.argv.slice(2));
