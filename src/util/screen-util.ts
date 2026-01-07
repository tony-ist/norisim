export function drawPixelCommand(x: number, y: number) {
  return y << 5 | x;
}
