import { randomInt } from 'crypto';
import { customAlphabet, nanoid } from 'nanoid';
import { v4 } from 'uuid';

export const generateUUID = () => v4();

type Chars = 'alphabet' | 'number' | 'alphanum' | 'any';
export const generateRandomChars = (length = 16, chars: Chars = 'alphanum'): string => {
  const lowerAlpha = Array(26)
    .fill(null)
    .map((_, i) => String.fromCharCode(i + 97))
    .join('');
  const upperAlpha = lowerAlpha.toUpperCase();
  const num = '0123456789';

  switch (chars) {
    case 'alphabet':
      return customAlphabet(`${lowerAlpha}${upperAlpha}`)(length);
    case 'number':
      return customAlphabet(`${num}`)(length);
    case 'any':
      return nanoid(length);
    default:
      return customAlphabet(`${num}${lowerAlpha}${upperAlpha}`)(length);
  }
};

type GetRandomDelayArg = { minSecs?: number; maxSecs?: number };
export const getRandomDelay = (opts: GetRandomDelayArg = {}) => {
  const min = opts.minSecs || 1;
  const max = opts.maxSecs || 60;

  const randomSecs = randomInt(min, max);

  return { s: randomSecs, ms: randomSecs * 1000 };
};
