import { BinaryToTextEncoding, CipherGCMTypes } from 'crypto';

export interface EncryptionArg {
  data: string;
  salt: string;
  algorithm?: CipherGCMTypes;
}

export interface CreateHmacArg {
  data: string;
  key: string;
  algorithm?: 'sha256' | 'sha512'; // TODO: look for the proper type.
  encoding?: BinaryToTextEncoding;
}

export type GenerateHashOpts = {
  alg: 'sha256' | 'sha512';
  encoding: BinaryToTextEncoding;
};
