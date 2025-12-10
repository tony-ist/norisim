import { AST, ASTNode, INSTRUCTIONS, IR, IRNode, OPERAND_TYPES } from '../types/asm.types';
import { createLabelMap } from './label-map';
import { parseToAST } from './parser';

export function compileToIR(code: string): IR {
  const ast = parseToAST(code);
  return generateIR(ast);
}

export function generateIR(ast: AST): IR {
  const result: IR = [];
  let address = 0;

  for (const astNode of ast) {
    const irNode = convertASTNodeToIRNode(astNode, address);
    result.push(irNode);
    address += 1;
  }

  return fillIRTargetAddresses(result);
}

function convertASTNodeToIRNode(astNode: ASTNode, address: number): IRNode {
  validateOperandTypes(astNode);

  const mnemonic = astNode.mnemonic;

  const info = INSTRUCTIONS[mnemonic as keyof typeof INSTRUCTIONS];

  if (!info) {
    throw new Error(`Invalid instruction: ${mnemonic}`);
  }

  return {
    mnemonic,
    operands: [...astNode.operands],
    format: info.format,
    address,
    label: astNode.label,
    inlineComment: astNode.inlineComment,
  };
}

function validateOperandTypes(astNode: ASTNode) {
  const format = INSTRUCTIONS[astNode.mnemonic as keyof typeof INSTRUCTIONS].format;

  if (astNode.operands.length !== OPERAND_TYPES[format].length) {
    throw new Error(`Invalid number of operands for ${astNode.mnemonic} instruction: ${astNode.operands.length}`);
  }

  for (let i = 0; i < astNode.operands.length; i++) {
    const operand = astNode.operands[i];
    const expectedType = OPERAND_TYPES[format][i];
    if (operand.type !== expectedType) {
      throw new Error(`Invalid operand type for ${astNode.mnemonic} instruction: ${operand.type}. Expected ${expectedType}.`);
    }
  }
}

function fillIRTargetAddresses(ir: IR): IR {
  const result: IR = [];
  const labelMap = createLabelMap(ir);

  for (const irNode of ir) {
    if (irNode.format === 'J') {
      const targetLabel = irNode.operands[0].value as string;
      const targetAddress = labelMap.get(targetLabel);

      if (targetAddress === undefined) {
        throw new Error(`Target label for J instruction ${irNode.mnemonic} not found: ${targetLabel}`);
      }

      result.push({
        ...irNode,
        operands: [
          {
            type: 'label',
            value: targetLabel,
            targetAddress,
          },
        ],
      });

      continue;
    }

    result.push(irNode);
  }

  return result;
}
