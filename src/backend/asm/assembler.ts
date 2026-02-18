import { AST, ASTNode, REAL_INSTRUCTIONS } from '../types/asm.types';

function convertASTNodeToMachineCode(astNode: ASTNode): number[] {
  const machineCode: number[] = [];
  switch (astNode.mnemonic) {
    case 'NOP':
      machineCode.push(REAL_INSTRUCTIONS.NOP.opcode);
      break;
  }
  return machineCode;
}

export function assemble(ast: AST): number[] {
  const machineCode: number[] = [];
  for (const astNode of ast) {
    const binary = convertASTNodeToMachineCode(astNode);
    machineCode.push(...binary);
  }
  return machineCode;
}
