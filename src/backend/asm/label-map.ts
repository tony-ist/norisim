import { AST } from "../types/asm.types";

export function createLabelMap(ast: AST): Map<string, number> {
  const labelMap: Map<string, number> = new Map();

  for (let i = 0; i < ast.length; i++) {
    const line = ast[i];
    if (line.label) {
      labelMap.set(line.label, i);
    }
  }

  return labelMap;
}
