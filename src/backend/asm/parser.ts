import fs from 'fs';
import * as ohm from 'ohm-js';
import * as extra from 'ohm-js/extras';
import { INSTRUCTIONS } from '../../const/nori-v1-constants';

export function parse(code: string) {
    const contents = fs.readFileSync('src/backend/asm/nori-v1.ohm', 'utf-8');
    const grammar = ohm.grammar(contents);

    const semantics = grammar.createSemantics().addOperation('compile', {
        program: (body: any) => {
            return body.children.map((line: any) => line.compile()).filter(Boolean)
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
            console.log(operands.children.map((child: any) => child.sourceString));
            const flagBool = flag ? 1 : 0;
            
            // operands.compile() fails with error `Assembly error: Missing semantic action for '_iter' in operation 'compile'.`
            switch (mnemonic.sourceString.toUpperCase()) {
                case 'LIM':
                    return mnemonic.compile() + operands.compile() << 5;
                case 'AND':
                    return mnemonic.compile() + operands.compile() << 5 + flagBool << 14;
                case 'NAND':
                    return INSTRUCTIONS.AND.opcode + operands.compile() << 5 + flagBool << 14;
                case 'HLT':
                    return mnemonic.compile();
                default:
                    throw new Error(`Invalid mnemonic: ${mnemonic.sourceString}`);
            }
        },
        operands: (expression: any, _sep: any, rest: any) => {
            return null;
        },
        expression: (expression: any) => {
            return null;
        },
        mnemonic: (mnemonic: any) => {
            const opcode = INSTRUCTIONS[mnemonic.sourceString.toUpperCase() as keyof typeof INSTRUCTIONS];

            if (!opcode) {
                throw new Error(`Invalid mnemonic: ${mnemonic.sourceString}`);
            }

            return opcode;
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
        console.log(bytes);
    }
}
