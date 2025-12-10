export function isLabel(line: string) {
  return line.startsWith('.');
}

export function padHexByte(byte: string) {
  return ('00' + byte).slice(-2);
}

export function toHexBytes(bytes: number[], prefix: boolean = false) {
  return bytes.map((byte) => (prefix ? '0x' : '') + padHexByte(byte.toString(16).toUpperCase()));
}

export function fromHex(hex: string[]) {
  return hex.map((x) => parseInt(x, 16));
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

export function isRegister(token:string) {
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
