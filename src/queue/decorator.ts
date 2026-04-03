import { applyDecorators } from '@nestjs/common';
import { QueueName } from './constants';
import { Processor } from '@nestjs/bullmq';
import { canProcessJobs, getAppType } from '@common/utils/env';

export function QueueWorker(queue: QueueName) {
  const appType = getAppType();
  if (canProcessJobs(appType)) {
    return applyDecorators(Processor(queue));
  } else {
    return applyDecorators();
  }
}
