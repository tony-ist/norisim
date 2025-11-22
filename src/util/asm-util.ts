export function isLabel(line: string) {
  return line.startsWith('.');
}

export function padHexByte(byte: string) {
  return byte.length === 1 ? '0' + byte : byte;
}

export function toHex(bytes: number[], prefix: boolean = false) {
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
