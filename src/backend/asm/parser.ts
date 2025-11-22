import fs from 'fs';
import * as ohm from 'ohm-js';
import * as extra from 'ohm-js/extras';
import { INSTRUCTIONS } from '../../const/nori-v1-constants';

export function parse(code: string) {
    const contents = fs.readFileSync('src/backend/asm/nori-v1.ohm', 'utf-8');
    const grammar = ohm.grammar(contents);

    const semantics = grammar.createSemantics().addOperation('compile', {
        program: (body: any) => {
            return body.children.map((line: any) => line.compile()).filter(((value: number | null) => value !== null));
        },
        instructionLine: (_inlineSpace: any, instruction: any, _inlineSpace2: any, _inlineComment: any, _newline: any) => {
            return instruction.compile();
        },
        commentLine: (_inlineSpace: any, comment: any, _newline: any) => {
            return comment.compile();
        },
        emptyLine: (_inlineSpace: any, _newline: any) => {
            return null;
        },
        comment: (_newline: any, _comment: any) => {
            return null;
        },
        instruction: (label: any, _space: any, mnemonic: any, flag: any, _space2: any, operands: any) => {
            const operandsOpcode = operands.children.map((child: any) => child.compile());
            console.log(`instruction ${mnemonic.sourceString} operands:`, operandsOpcode); // [ 'r1, 3' ]
            console.log(`mnemonic.compile():`, mnemonic.compile());
            const flagBool = flag ? 1 : 0;
            
            switch (mnemonic.sourceString.toUpperCase()) {
                case 'LIM':
                    return mnemonic.compile() + operandsOpcode << 5;
                case 'AND':
                    return mnemonic.compile() + operandsOpcode << 5 + flagBool << 14;
                case 'NAND':
                    return INSTRUCTIONS.AND.opcode + operandsOpcode << 5 + flagBool << 14;
                case 'ADD':
                    return 1;
                case 'ADDI':
                    return 2;
                case 'MOV':
                    return 3;
                case 'JNZ':
                    return 4;
                case 'PST':
                    return 5;
                case 'HLT':
                    return 6;
                default:
                    throw new Error(`Invalid mnemonic: ${mnemonic.sourceString}`);
            }
        },
        operands: (expression: any, _sep: any, rest: any) => {
            return expression.compile() + rest.children.map((child: any) => child.compile());
        },
        expression: (expression: any) => {
            return expression.compile();
        },
        register: (register: any) => {
            return register.sourceString.toUpperCase();
        },
        immediate: (minus: any, immediate: any) => {
            return immediate.sourceString;
        },
        labelAddress: (dot: any, labelAddress: any) => {
            return labelAddress.sourceString;
        },
        mnemonic: (mnemonic: any) => {
            const instruction = INSTRUCTIONS[mnemonic.sourceString.toUpperCase() as keyof typeof INSTRUCTIONS];

            if (!instruction) {
                throw new Error(`Invalid mnemonic: ${mnemonic.sourceString}`);
            }

            return instruction.opcode;
        },
    });

    // const traceResult = grammar.trace(code);
    // console.log(traceResult.toString());
    
    const matchResult = grammar.match(code);
    console.log(matchResult.message);

    console.error(`Succeeded: ${matchResult.succeeded()}`);
    console.log();

    if (matchResult.succeeded()) {
        const mapping = {
            program: {
                body: 0
            },
            programLine: {
                body: 0,
            },
            commentLine: {
                body: 1,
            },
            emptyLine: {
                body: null
            },
            instructionLine: {
                instruction: 1,
                inlineComment: 3,
            },
            inlineComment: {
                body: 0,
            },
            instruction: {
                label: 0,
                mnemonic: 2,
                operands: 5
            },
            operands: (first: any, _sep: any, rest: any): any[] => {
                return [first.toAST(mapping), ...rest.toAST(mapping)];
            },
        };

        const ast = extra.toAST(matchResult, mapping);
        console.log(JSON.stringify(ast, null, 2));

        const bytes = semantics(matchResult).compile();
        console.log('Compiled bytes:', bytes);
    }
}
