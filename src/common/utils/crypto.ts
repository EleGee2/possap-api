import { createHash, createHmac } from 'crypto';
import { CreateHmacArg, GenerateHashOpts } from './types';
import argon2 from 'argon2';

export const generateHmac = ({
  data,
  key,
  algorithm = 'sha512',
  encoding = 'hex',
}: CreateHmacArg) =>
  new Promise<string>((resolve, reject) => {
    try {
      const hmac = createHmac(algorithm, key).update(data).digest(encoding);
      resolve(hmac);
    } catch (error) {
      reject(error);
    }
  });

export const generateHash = (
  data: string,
  opts: GenerateHashOpts = { alg: 'sha512', encoding: 'base64url' },
) =>
  new Promise<string>((resolve, reject) => {
    try {
      const hash = createHash(opts.alg).update(data).digest(opts.encoding);
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });

export const hashPassword = (password: string) => {
  return argon2.hash(password);
};

export const comparePasswordWithHash = (password: string, hash: string) => {
  return argon2.verify(hash, password);
};
