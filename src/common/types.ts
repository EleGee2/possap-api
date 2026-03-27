import { BulkJobOptions } from 'bullmq';
import { InferAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

export type MockedModel = {
  [P in keyof Omit<
    typeof Model,
    | 'associations'
    | 'options'
    | 'primaryKeyAttribute'
    | 'primaryKeyAttributes'
    | 'prototype'
    | 'sequelize'
    | 'tableName'
    | 'rawAttributes'
  >]: jest.Mock;
};

type RawModelAttributes<T extends Model> = InferAttributes<
  T,
  { omit: 'createdAt' | 'updatedAt' | 'deletedAt' | 'version' }
>;
export type RawModel<T extends Model> = RawModelAttributes<T> | null;

export type RawModelWithAttributes<T extends Model, A extends keyof RawModelAttributes<T>> = Pick<
  RawModelAttributes<T>,
  A
>;

export type BulkQueueJob<JobName, JobData> = {
  name: JobName;
  data: JobData;
  opts?: BulkJobOptions;
};
