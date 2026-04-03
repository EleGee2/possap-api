import { BulkJobOptions } from 'bullmq';

export type QueueJob<JobName, JobData> = {
  name: JobName;
  data: JobData;
  opts?: BulkJobOptions;
};
