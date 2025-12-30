import { describe, expect, it } from 'vitest';
import { asSignedByte, countBits, isSignedByteInBounds } from './asm-util.ts';

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

describe('isSignedByteInBounds', () => {
  it.each([
    [0, true],
    [1, true],
    [-1, true],
    [-128, true],
    [-129, false],
    [127, true],
    [128, false],
  ])('for %s should return %s', (number, expected) => {
    expect(isSignedByteInBounds(number)).toEqual(expected);
  });
});

describe('asSignedByte', () => {
  it.each([
    [0, 0],
    [1, 1],
    [127, 127],
    [128, -128],
    [255, -1],
  ])('for %s should return %s', (number, expected) => {
    expect(asSignedByte(number)).toEqual(expected);
  });

  it.each([
    256,
    -1,
  ])('for %s should throw an error', (number) => {
    expect(() => asSignedByte(number)).toThrow(`Cannot convert ${number} to signed byte: value must be an integer between 0 and 255`);
  });
});
