import { Processor } from '@nestjs/bullmq';
import { applyDecorators } from '@nestjs/common';
import { canProcessJobs, getAppType } from '@common/utils/env';
import { QueueName } from '@src/queue/constants';

export function QueueWorker(queue: QueueName) {
  const appType = getAppType();
  if (canProcessJobs(appType)) {
    return applyDecorators(Processor(queue));
  } else {
    return applyDecorators();
  }
}
