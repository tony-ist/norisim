import { describe, expect, it } from 'vitest';
import { generateLabels, VALUES_IN_A_ROW } from './hex-viewer-util.ts';

describe('generateLabels', () => {
  it('should generate 1 label', () => {
    expect(generateLabels(VALUES_IN_A_ROW)).toEqual(['0000']);
  });

  it('should generate 2 labels', () => {
    expect(generateLabels(VALUES_IN_A_ROW + 1)).toEqual(['0000', '0010']);
  });
});
