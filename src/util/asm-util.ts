export function isLabel(line: string) {
  return line.startsWith('.');
}

export function padHexByte(byte: string) {
  return ('00' + byte).slice(-2);
}

export function toHexBytes(bytes: number[], prefix: boolean = false) {
  return bytes.map(byte => (prefix ? '0x' : '') + padHexByte(byte.toString(16).toUpperCase()));
}

export function fromHex(hex: string[]) {
  return hex.map(x => parseInt(x, 16));
}

export function isDecimalNumber(token: string) {
  return /^[0-9]+$/.test(token);
}

export function isHexNumber(token: string) {
  return token.startsWith('0x');
}

export function isBinaryNumber(token: string) {
  return token.startsWith('0b');
}

export function isRegister(token: string) {
  return token.toUpperCase().startsWith('R');
}

export function isDefinition(line: string) {
  return line.toUpperCase().startsWith('@DEFINE');
}

export function countBits(number: number) {
  if (number < 0) {
    throw new Error(`Cannot count bits of a negative number ${number}`);
  }

  if (number === 0) {
    return 0;
  }

  return number.toString(2).length;
}

export function padHexWord(word: string) {
  return ('0000' + word).slice(-4);
}

export function toHexWord(number: number) {
  return '0x' + padHexWord(number.toString(16).toUpperCase());
}

export function isSignedByteInBounds(value: number) {
  return value >= -128 && value < 128;
}

export function isUnsignedByteInBounds(value: number) {
  return value >= 0 && value < 256;
}

export function asSignedByte(value: number) {
  if (value < 0 || value > 255 || !Number.isInteger(value)) {
    throw new Error(`Cannot convert ${value} to signed byte: value must be an integer between 0 and 255`);
  }

  return value < 128 ? value : value - 256;
}

export function asUnsignedByte(value: number) {
  if (!isSignedByteInBounds(value)) {
    throw new Error(`Cannot convert ${value} to unsigned byte: value must be an integer between -128 and 127 inclusive`);
  }

  return value < 0 ? value + 256 : value;
}

export function truncateTo8BitUnsigned(value: number) {
  return value & 0xFF;
}

export function isNegative(value: number) {
  return (value & 0x80) !== 0;
}

export function extractHighByte(value: number) {
  return value >>> 8;
}

export function extractLowByte(value: number) {
  return value & 0xFF;
}

export function split16BitInto8Bit(value: number) {
  return [value >>> 8, value & 0xFF];
}
