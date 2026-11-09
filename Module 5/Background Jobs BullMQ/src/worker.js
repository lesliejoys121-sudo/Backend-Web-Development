'use strict';

// ─── YOUR FILE, implement this ───────────────────────────────────────────────
// Create a BullMQ Worker that processes jobs from the 'email' queue.
//
// Requirements:
//  1. Handle job.name === 'otp': send an email with the OTP using transporter.
//  2. Configure retries: attempts: 3, backoff: { type: 'exponential', delay: 1000 }
//  3. Log worker.on('completed') and worker.on('failed') events.
//  4. Throwing inside the worker function → job fails → BullMQ retries.
//     Returning without throwing → job completed.

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker('email', async (job) => {
  if (job.name !== 'otp') {
    throw new Error(`Unknown email job: ${job.name}`);
  }

  await transporter.sendMail({
    to: job.data.to,
    subject: 'Your verification code',
    text: `Your verification code is ${job.data.otp}.`,
  });
}, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});

worker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id || 'unknown'} failed:`, err.message);
});

module.exports = { worker };
