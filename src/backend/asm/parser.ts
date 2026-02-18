import * as ohm from 'ohm-js';
import { preprocess } from './preprocessor';
import { AST } from '../types/asm.types';
import grammarContents from './nori-v1.ohm?raw';
import { asUnsignedByte, isUnsignedByteInBounds } from '../../util/asm-util';
import { GPR_COUNT } from '../../const/simulator-constants';

export function parseToAST(code: string, parserTrace: boolean = false): AST {
  const preprocessedCode = preprocess(code);
  const grammar = ohm.grammar(grammarContents);

  const semantics = grammar.createSemantics();

  semantics.addOperation('toAST', {
    program: programLines => programLines.toAST(),

    programLine: content => content.toAST(),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emptyLine: (_space, _newline) => null,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    commentLine: (_space, _comment, _newline) => null,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instructionLine: (_inlineSpace, instruction, _inlineSpace2, inlineComment, _newline) => {
      const instr = instruction.toAST();
      const comment = inlineComment.toAST();

      if (comment[0]) {
        return { ...instr, inlineComment: comment[0] };
      }

      return instr;
    },

    inlineComment: comment => comment.toAST(),

    comment: (_slashes, content) => content.sourceString.trim(),

    instruction: (label, _space, mnemonic, flag, _inlineSpace, operandList) => {
      const labelMixin = label.sourceString === '' ? {} : { label: label.sourceString.trim() };

      return {
        mnemonic: mnemonic.sourceString.toUpperCase(),
        forceUpdateFlags: flag.sourceString === '.f',
        ...labelMixin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        operands: operandList.children.map((operand: any) => operand.toAST())[0] ?? [],
      };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operandList: (operand, _sep, operandList) => [operand.toAST(), ...operandList.children.map((operand: any) => operand.toAST())],

    operand: body => body.toAST(),

    register: (_r, digit) => {
      const registerNumber = parseInt(digit.sourceString);
      if (registerNumber < 0 || registerNumber >= GPR_COUNT) {
        throw new Error(`Invalid register number: R${registerNumber}. Valid registers are R0-R${GPR_COUNT - 1}`);
      }
      return {
        type: 'register',
        value: registerNumber,
      };
    },

    immediate: (minus, prefix, immediate) => {
      const prefixString = prefix.sourceString;
      const base = prefixString === '0b' ? 2 : prefixString === '0x' ? 16 : 10;
      const immediateString = immediate.sourceString.replace(/_/g, '');
      const value = parseInt(immediateString, base);
      const isNegative = minus.sourceString === '-';

      if (base === 10) {
        const fullValue = isNegative ? -value : value;
        const unsignedValue = asUnsignedByte(fullValue);

        return {
          type: 'immediate',
          value: unsignedValue,
        };
      }

      if (isNegative) {
        throw new Error(`Negative values are only allowed for decimal immediates`);
      }

      if (!isUnsignedByteInBounds(value)) {
        throw new Error(`Immediate unsigned value ${value} is out of bounds from 0 to 255 inclusive`);
      }

      return {
        type: 'immediate',
        value,
      };
    },

    label: (_dot, label) => ({
      type: 'label',
      value: '.' + label.sourceString.trim(),
    }),

    _iter: (...children) => children.map(c => c.toAST()).filter(x => x !== null),
  });

  const matchResult = grammar.match(preprocessedCode);

  if (matchResult.succeeded()) {
    if (parserTrace) {
      const traceResult = grammar.trace(preprocessedCode);
      console.log(traceResult.toString());
    }

    return semantics(matchResult).toAST();
  }

  throw new Error(`Failed to parse: ${matchResult.message}`);
}
