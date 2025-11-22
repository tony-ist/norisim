import fs from 'fs';
import * as ohm from 'ohm-js';
import * as extra from 'ohm-js/extras';
import { INSTRUCTIONS } from '../../const/nori-v1-constants';
import { toHex } from '../../util/asm-util';

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
        instruction: (label: any, _space: any, instructionX: any) => {
            return instructionX.compile();
        },
        instructionX: (body: any) => {
            return body.compile();
        },
        instructionA: (mnemonic: any, flag: any, _space: any, dest: any, _sep: any, srcA: any, _sep2: any, srcB: any) => {
            const flagBool = flag.sourceString === null ? 0 : 1;
            return mnemonic.compile() + srcA.compile() << 5 + srcB.compile() << 8 + dest.compile() << 11 + flagBool << 14;
        },
        instructionB: (mnemonic: any, flag: any, _space: any, dest: any, _sep: any, src: any) => {
            const flagBool = flag.sourceString === null ? 0 : 1;
            return mnemonic.compile() + src.compile() << 5 + dest.compile() << 8 + flagBool << 14;
        },
        instructionC: (mnemonic: any, _space: any, address: any, _sep: any, register: any) => {
            return mnemonic.compile() + register.compile() << 5 + parseInt(address.sourceString) << 8;
        },
        instructionD: (mnemonic: any, _space: any, register: any) => {
            return mnemonic.compile() + register.compile() << 5;
        },
        instructionI: (mnemonic: any, _space: any, register: any, _sep: any, immediate: any) => {
            return mnemonic.compile() + register.compile() << 5 + immediate.compile() << 8;
        },
        instructionJ: (mnemonic: any, _space: any, label: any) => {
            // TODO: Implement label compilation
            return mnemonic.compile();
        },
        instructionZ: (mnemonic: any) => {
            return mnemonic.compile();
        },
        register: (register: any) => {
            return parseInt(register.sourceString[1]);
        },
        immediate: (minus: any, immediate: any) => {
            const nonNegativeImmediate = parseInt(immediate.sourceString);
            return minus === null ? nonNegativeImmediate : -nonNegativeImmediate;
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
                instructionX: 2,
            },
            instructionX: {
                body: 0,
            },
            instructionA: {
                mnemonic: 0,
                flag: 1,
                dest: 3,
                srcA: 5,
                srcB: 7,
            },
            instructionB: {
                mnemonic: 0,
                flag: 1,
                dest: 3,
                src: 5,
            },
            instructionC: {
                mnemonic: 0,
                address: 2,
                register: 4,
            },
            instructionD: {
                mnemonic: 0,
                register: 2,
            },
            instructionI: {
                mnemonic: 0,
                register: 2,
                immediate: 4,
            },
            instructionJ: {
                mnemonic: 0,
                label: 2,
            },
            instructionZ: {
                mnemonic: 0,
            },
        };

        const ast = extra.toAST(matchResult, mapping);
        console.log(JSON.stringify(ast, null, 2));

        const bytes = semantics(matchResult).compile();
        console.log('Compiled bytes (dec):', bytes);
        console.log('Compiled bytes (hex):', toHex(bytes, true));
    }
}
