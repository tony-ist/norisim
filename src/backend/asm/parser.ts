import fs from 'fs';
import * as ohm from 'ohm-js';
import { preprocess } from './preprocessor';
import { AST } from '../types/ast.types';

export function parseToAST(code: string, parserTrace: boolean = false): AST {
    const preprocessedCode = preprocess(code);
    const contents = fs.readFileSync('src/backend/asm/nori-v1.ohm', 'utf-8');
    const grammar = ohm.grammar(contents);

    const semantics = grammar.createSemantics();
    
    semantics.addOperation('toAST', {
        program: (lines) => lines.toAST(),
    
        programLine: (content) => content.toAST(),
    
        emptyLine: (_space, _newline) => null,

        commentLine: (_space, _comment, _newline) => null,
    
        instructionLine: (_inlineSpace, instruction, _inlineSpace2, inlineComment, _newline) => {
            const instr = instruction.toAST();
            const comment = inlineComment.toAST();

            if (comment[0]) {
                return { ...instr, inlineComment: comment[0] };
            } 
                
            return instr;
        },
    
        inlineComment: (comment) => comment.toAST(),
    
        comment: (_newline, content) => content.sourceString.trim(),
        
        instruction: (label, _space, mnemonic, flag, _inlineSpace, operandList) => {
            const labelMixin = label.sourceString === "" ? {} : { label: label.sourceString.trim() };

            return {
                mnemonic: mnemonic.sourceString,
                forceUpdateFlags: flag.sourceString === ".f",
                ...labelMixin,
                operands: operandList.children.map((operand: any) => operand.toAST()),
            }
        },

        operandList: (operand, _sep, operandList) => [operand.toAST(), ...operandList.children.map((operand: any) => operand.toAST())],

        operand: (body) => body.toAST(),

        register: (_r, digit) => ({
            type: 'register',
            value: parseInt(digit.sourceString),
        }),

        immediate: (minus, immediate) => ({
            type: 'immediate',
            value: minus.sourceString === "-" ? -parseInt(immediate.sourceString) : parseInt(immediate.sourceString),
        }),

        label: (_dot, label) => ({
            type: 'label',
            value: "." + label.sourceString.trim(),
        }),

        _iter: (...children) => children.map(c => c.toAST()).filter(x => x?.mnemonic)
    })

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
