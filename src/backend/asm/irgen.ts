import { SCREEN_OUTPUT_PORT } from '../../const/screen-constants';
import { extractHighByte, extractLowByte } from '../../util/asm-util';
import { drawPixelCommand } from '../../util/screen-util';
import { AST, ASTNode, REAL_INSTRUCTIONS, IR, IRNode, REAL_INSTRUCTIONS_OPERAND_TYPES, PSEUDO_INSTRUCTION_MNEMONICS, PseudoInstructionMnemonic, PSEUDO_INSTRUCTION_OPERAND_TYPES, ASTInstructionMnemonic, RealInstructionMnemonic, REAL_INSTRUCTION_MNEMONICS } from '../types/asm.types';
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
    const irNodes = convertASTNodeToIRNodes(astNode, address);
    result.push(...irNodes);
    address += irNodes.length;
  }

  return fillIRTargetAddresses(result);
}

function convertASTNodeToIRNodes(astNode: ASTNode, address: number): IRNode[] {
  validateOperandTypes(astNode);

  const mnemonic = astNode.mnemonic;

  if (isPseudoInstruction(mnemonic)) {
    return lowerPseudoInstruction(astNode, address);
  }

  const info = REAL_INSTRUCTIONS[mnemonic as keyof typeof REAL_INSTRUCTIONS];

  if (!info) {
    throw new Error(`Invalid instruction mnemonic: ${mnemonic}`);
  }

  return [{
    mnemonic,
    operands: [...astNode.operands],
    format: info.format,
    address,
    label: astNode.label,
    inlineComment: astNode.inlineComment,
    forceUpdateFlags: astNode.forceUpdateFlags,
  }];
}

function lowerPseudoInstruction(astNode: ASTNode, address: number): IRNode[] {
  switch (astNode.mnemonic) {
    case 'INC':
      return [{
        mnemonic: 'ADDI',
        operands: [astNode.operands[0], { type: 'immediate', value: 1 }],
        format: 'I',
        address,
        label: astNode.label,
        inlineComment: astNode.inlineComment,
        forceUpdateFlags: astNode.forceUpdateFlags,
      }];
    case 'DEC':
      return [{
        mnemonic: 'ADDI',
        operands: [astNode.operands[0], { type: 'immediate', value: -1 }],
        format: 'I',
        address,
        label: astNode.label,
        inlineComment: astNode.inlineComment,
        forceUpdateFlags: astNode.forceUpdateFlags,
      }];
    case 'PXL': {
      const command = drawPixelCommand(astNode.operands[0].value as number, astNode.operands[1].value as number);
      const highByte = extractHighByte(command);
      const lowByte = extractLowByte(command);
      return [
        {
          mnemonic: 'LIM',
          operands: [{ type: 'register', value: 7 }, { type: 'immediate', value: highByte }],
          format: 'I',
          address,
          label: astNode.label,
          inlineComment: astNode.inlineComment,
          forceUpdateFlags: astNode.forceUpdateFlags,
        },
        {
          mnemonic: 'PST',
          operands: [{ type: 'register', value: 7 }, { type: 'immediate', value: SCREEN_OUTPUT_PORT }],
          format: 'I',
          address: address + 1,
          label: astNode.label,
          inlineComment: astNode.inlineComment,
          forceUpdateFlags: astNode.forceUpdateFlags,
        },
        {
          mnemonic: 'LIM',
          operands: [{ type: 'register', value: 7 }, { type: 'immediate', value: lowByte }],
          format: 'I',
          address: address + 2,
          label: astNode.label,
          inlineComment: astNode.inlineComment,
          forceUpdateFlags: astNode.forceUpdateFlags,
        },
        {
          mnemonic: 'PST',
          operands: [{ type: 'register', value: 7 }, { type: 'immediate', value: SCREEN_OUTPUT_PORT }],
          format: 'I',
          address: address + 3,
          label: astNode.label,
          inlineComment: astNode.inlineComment,
          forceUpdateFlags: astNode.forceUpdateFlags,
        },
      ];
    }
  }

  throw new Error(`Invalid pseudo instruction mnemonic: ${astNode.mnemonic}`);
}

function validateOperandTypes(astNode: ASTNode) {
  if (isPseudoInstruction(astNode.mnemonic)) {
    const expectedOperandTypes = PSEUDO_INSTRUCTION_OPERAND_TYPES[astNode.mnemonic as PseudoInstructionMnemonic];
    if (astNode.operands.length !== expectedOperandTypes.length) {
      throw new Error(`Invalid number of operands for ${astNode.mnemonic} pseudo instruction: ${astNode.operands.length}`);
    }

    for (let i = 0; i < astNode.operands.length; i++) {
      const operand = astNode.operands[i];
      const expectedType = expectedOperandTypes[i];
      if (operand.type !== expectedType) {
        throw new Error(`Invalid operand type ${operand.type} with index ${i} for ${astNode.mnemonic} pseudo instruction. Expected ${expectedType}.`);
      }
    }
  }

  if (isRealInstruction(astNode.mnemonic)) {
    const instruction = REAL_INSTRUCTIONS[astNode.mnemonic];

    if (!instruction) {
      throw new Error(`Invalid instruction mnemonic: ${astNode.mnemonic}`);
    }

    const format = REAL_INSTRUCTIONS[astNode.mnemonic as keyof typeof REAL_INSTRUCTIONS].format;

    if (astNode.operands.length !== REAL_INSTRUCTIONS_OPERAND_TYPES[format].length) {
      throw new Error(`Invalid number of operands for ${astNode.mnemonic} instruction: ${astNode.operands.length}`);
    }

    for (let i = 0; i < astNode.operands.length; i++) {
      const operand = astNode.operands[i];
      const expectedType = REAL_INSTRUCTIONS_OPERAND_TYPES[format][i];
      if (operand.type !== expectedType) {
        throw new Error(`Invalid operand type for ${astNode.mnemonic} instruction: ${operand.type}. Expected ${expectedType}.`);
      }
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

function isRealInstruction(mnemonic: ASTInstructionMnemonic): mnemonic is RealInstructionMnemonic {
  return REAL_INSTRUCTION_MNEMONICS.includes(mnemonic as RealInstructionMnemonic);
}

function isPseudoInstruction(mnemonic: ASTInstructionMnemonic): mnemonic is PseudoInstructionMnemonic {
  return PSEUDO_INSTRUCTION_MNEMONICS.includes(mnemonic as PseudoInstructionMnemonic);
}
