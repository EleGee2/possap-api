const mockProcessorDecorator = jest.fn();
import * as env from '@common/utils/env';
import { QueueWorker } from './decorators';
import { QueueName } from './constants';

jest.mock('@nestjs/bullmq', () => ({
  Processor: mockProcessorDecorator,
}));

describe('@QueueWorker()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should apply processor if app type is "web-worker"', async () => {
    jest.spyOn(env, 'getAppType').mockReturnValueOnce(env.AppType.WebWorker);

    QueueWorker(QueueName.Cron);

    expect(mockProcessorDecorator).toHaveBeenCalledTimes(1);
    expect(mockProcessorDecorator).toHaveBeenCalledWith(QueueName.Cron);
  });

  it('should apply processor if app type is "worker"', async () => {
    jest.spyOn(env, 'getAppType').mockReturnValueOnce(env.AppType.WebWorker);

    QueueWorker(QueueName.Cron);

    expect(mockProcessorDecorator).toHaveBeenCalledTimes(1);
    expect(mockProcessorDecorator).toHaveBeenCalledWith(QueueName.Cron);
  });

  it('should not apply processor if app type is "web"', async () => {
    jest.spyOn(env, 'getAppType').mockReturnValueOnce(env.AppType.Web);

    QueueWorker(QueueName.Cron);

    expect(mockProcessorDecorator).not.toHaveBeenCalled();
  });
});
