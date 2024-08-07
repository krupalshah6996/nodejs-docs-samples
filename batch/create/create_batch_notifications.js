/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START batch_notifications]
// Imports the Batch library
const batchLib = require('@google-cloud/batch');
const batch = batchLib.protos.google.cloud.batch.v1;

// Instantiates a client
const batchClient = new batchLib.v1.BatchServiceClient();

/**
 * TODO(developer): Update these variables before running the sample.
 */
// Project ID or project number of the Google Cloud project you want to use.
const PROJECT_ID = 'project-id';
// Name of the region you want to use to run the job. Regions that are
// available for Batch are listed on: https://cloud.google.com/batch/docs/get-started#locations
const REGION = 'europe-central2';
// The name of the job that will be created.
// It needs to be unique for each project and region pair.
const JOB_NAME = 'job-name-batch-notifications';
// The Pub/Sub topic ID to send the notifications to.
const TOPIC_ID = 'topic-id';

async function main() {
  await callCreateBatchNotifications(PROJECT_ID, REGION, JOB_NAME, TOPIC_ID);
}

async function callCreateBatchNotifications(
  projectId,
  region,
  jobName,
  topicId
) {
  // Define what will be done as part of the job.
  const task = new batch.TaskSpec();
  const runnable = new batch.Runnable();
  runnable.script = new batch.Runnable.Script();
  runnable.script.commands = [
    '-c',
    'echo Hello world! This is task ${BATCH_TASK_INDEX}.',
  ];
  task.runnables = [runnable];
  task.maxRetryCount = 2;
  task.maxRunDuration = {seconds: 3600};

  // Tasks are grouped inside a job using TaskGroups.
  const group = new batch.TaskGroup();
  group.taskCount = 3;
  group.taskSpec = task;

  const job = new batch.Job();
  job.name = jobName;
  job.taskGroups = [group];
  job.labels = {env: 'testing', type: 'script'};
  // We use Cloud Logging as it's an option available out of the box
  job.logsPolicy = new batch.LogsPolicy();
  job.logsPolicy.destination = batch.LogsPolicy.Destination.CLOUD_LOGGING;

  // Create batch notification when job state changed
  const notification1 = new batch.JobNotification();
  notification1.pubsubTopic = `projects/${projectId}/topics/${topicId}`;
  notification1.message = {
    type: 'JOB_STATE_CHANGED',
  };

  // Create batch notification when task state changed
  const notification2 = new batch.JobNotification();
  notification2.pubsubTopic = `projects/${projectId}/topics/${topicId}`;
  notification2.message = {
    type: 'TASK_STATE_CHANGED',
    newTaskState: 'FAILED',
  };

  job.name = jobName;
  job.taskGroups = [group];
  job.notifications = [notification1, notification2];
  job.labels = {env: 'testing', type: 'script'};
  // We use Cloud Logging as it's an option available out of the box
  job.logsPolicy = new batch.LogsPolicy();
  job.logsPolicy.destination = batch.LogsPolicy.Destination.CLOUD_LOGGING;
  // The job's parent is the project and region in which the job will run
  const parent = `projects/${projectId}/locations/${region}`;
  // Construct request
  const request = {
    parent,
    jobId: jobName,
    job,
  };

  // Run request
  const [response] = await batchClient.createJob(request);
  console.log(JSON.stringify(response));
  // [END batch_notifications]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();

module.exports = {
  callCreateBatchNotifications,
};
