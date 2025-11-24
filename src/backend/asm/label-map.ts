import { AST } from "../types/ast.types";

export function createLabelMap(ast: AST): Record<string, number> {
  const labelMap: Record<string, number> = {};

  for (let i = 0; i < ast.length; i++) {
    const line = ast[i];
    if (line.label) {
      labelMap[line.label] = i;
    }
  }

  return labelMap;
}
