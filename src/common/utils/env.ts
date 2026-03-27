import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();

export enum AppType {
  Worker = 'worker', // no http listening interface exposed, can only process crons/queue tasks
  Web = 'web', // only serves http requests - can put items on the queue, but CANNOT process queue items
  WebWorker = 'web-worker', // can simultaneously serve requests & process jobs
}

enum Workload {
  Web = 'web',
  Worker = 'worker',
}

const workloadsSchema = Joi.array()
  .items(Joi.string().valid(Workload.Web, Workload.Worker).lowercase())
  .min(1);

export const getAppType = () => {
  const configuredWorkloads = process.env.WORKLOADS || 'web,worker';

  const { error, value } = workloadsSchema.validate(configuredWorkloads.split(','));

  if (error) {
    console.error(`
Invalid WORKLOADS environment passed!
Current value: ${configuredWorkloads}
Expected format: /[a-z](,[a-z])?/i
Valid workloads: ${Object.values(Workload).join(', ')}
Example: web,worker
    `);

    //! this exit on purpose:
    //! app should NOT be running if we can't ascertain the configured workloads
    process.exit(1);
  }

  const workloadSet = new Set(value);

  if (workloadSet.has('web') && workloadSet.has('worker')) {
    return AppType.WebWorker;
  }

  if (workloadSet.has('worker')) {
    return AppType.Worker;
  }

  return AppType.Web;
};

export const canProcessJobs = (appType: AppType) => {
  const jobProcessingAppTypes = new Set([AppType.WebWorker, AppType.Worker]);
  return jobProcessingAppTypes.has(appType);
};
