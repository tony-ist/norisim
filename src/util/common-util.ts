export function isBitSet(value: number, bitIndex: number) {
  return (value >> bitIndex) % 2 === 1;
}

export function groupElements<T>(array: T[], groupSize: number) {
  if (groupSize < 1) {
    throw new Error('Group size should be more than zero');
  }

  const result = [];
  let buffer = [];
  let i = 1;

  for (const element of array) {
    buffer.push(element);

    if (i === groupSize) {
      result.push(buffer);
      buffer = [];
      i = 1;
    } else {
      i += 1;
    }
  }

  if (buffer.length > 0) {
    result.push(buffer);
  }

  return result;
}

export function transpose<T>(array: T[][]) {
  const result = [];

  for (let i = 0; i < array[0].length; i++) {
    const row = [];
    for (let j = 0; j < array.length; j++) {
      row.push(array[j][i]);
    }
    result.push(row);
  }

  return result;
}
