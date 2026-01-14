export function drawPixelCommand(x: number, y: number) {
  return y << 5 | x;
}

export function clearPixelCommand(x: number, y: number) {
  return 1 << 10 | y << 5 | x;
}

export function clearBufferCommand() {
  return 3 << 10;
}

export function drawBufferCommand() {
  return 2 << 10;
}
