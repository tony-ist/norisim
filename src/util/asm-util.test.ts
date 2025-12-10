import { describe, expect, it } from 'vitest';
import { countBits } from './asm-util.ts';

describe('countBits', () => {
  it.each([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 2],
    [4, 3],
    [Math.pow(2, 11) - 1, 11],
    [Math.pow(2, 11), 12],
  ])('for %s should return %s', (number, expected) => {
    expect(countBits(number)).toEqual(expected);
  });

  it('should throw an error if the number is negative', () => {
    expect(() => countBits(-1)).toThrow('Cannot count bits of a negative number -1');
  });
});
