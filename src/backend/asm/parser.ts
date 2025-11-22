import fs from 'fs';
import * as ohm from 'ohm-js';
import { INSTRUCTIONS } from '../../const/nori-v1-constants';
import { toHex } from '../../util/asm-util';

function parseRegister(register: string) {
    return parseInt(register[1]);
}

function parseAddress(address: string) {
    return address;
}

function parseImmediate(immediate: string) {
    return parseInt(immediate);
}

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

    semantics.addOperation('toAST', {
        program: (lines) => lines.toAST(),
    
        programLine: (content) => content.toAST(),
    
        emptyLine: (_space, _newline) => null,

        commentLine: (_space, _comment, _newline) => null,
    
        instructionLine: (_inlineSpace, instruction, _inlineSpace2, inlineComment, _newline) => {
            const instr = instruction.toAST();
            const comment = inlineComment.toAST();
            console.log('comment', comment);
            return { ...instr, inlineComment: comment[0] ?? null };
        },
    
        inlineComment: (comment) => comment.toAST(),
    
        comment: (_newline, content) => content.sourceString.trim(),
        
        instruction: (label, _space, instrX) => {
            const base = instrX.toAST();
            if (label.sourceString) {
                return { ...base, label: label.sourceString.trim() };
            }
            return base;
        },
    
        instructionX: (instrustion) => instrustion.toAST(),
    
        instructionA: (mnemonic, flagNode, _ws1, dest, _ws2, srcA, _ws3, srcB) => ({
            type: "instructionA",
            mnemonic: mnemonic.sourceString.toUpperCase(),
            updateFlags: flagNode.sourceString ? 1 : 0, 
            dest: parseRegister(dest.sourceString),
            srcA: parseRegister(srcA.sourceString),
            srcB: parseRegister(srcB.sourceString),
        }),
    
        instructionB: (mnemonic, flagNode, _ws1, dest, _ws2, src) => ({
            type: "instructionB",
            mnemonic: mnemonic.sourceString,
            updateFlags: flagNode.sourceString ? 0 : 1,  
            dest: parseRegister(dest.sourceString),
            src: parseRegister(src.sourceString),
        }),
    
        instructionC: (mnemonic, _ws1, address, _ws2, register) => ({
            type: "instructionC",
            mnemonic: mnemonic.sourceString,
            address: parseAddress(address.sourceString),
            register: parseRegister(register.sourceString),
        }),
    
        instructionD: (mnemonic, _ws1, register) => ({
            type: "instructionD",
            mnemonic: mnemonic.sourceString,
            register: parseRegister(register.sourceString),
        }),
    
        instructionI: (mnemonic, _ws1, register, _ws2, immediate) => ({
            type: "instructionI",
            mnemonic: mnemonic.sourceString,
            register: parseRegister(register.sourceString),
            immediate: parseImmediate(immediate.sourceString),
        }),
    
        instructionJ: (mnemonic, _ws1, label) => ({
            type: "instructionJ",
            mnemonic: mnemonic.sourceString,
            label: label.sourceString,
        }),
    
        instructionZ: (mnemonic) => ({
            type: "instructionZ",
            mnemonic: mnemonic.sourceString,
        }),
    
        _iter: (...children) => children.map(c => c.toAST()).filter(x => x !== null)
    });

    // const traceResult = grammar.trace(code);
    // console.log(traceResult.toString());
    
    const matchResult = grammar.match(code);
    console.log(matchResult.message);

    console.error(`Succeeded: ${matchResult.succeeded()}`);
    console.log();

    if (matchResult.succeeded()) {
        const astSemantic = semantics(matchResult).toAST();
        console.log(JSON.stringify(astSemantic, null, 2));

        const bytes = semantics(matchResult).compile();
        console.log('Compiled bytes (dec):', bytes);
        console.log('Compiled bytes (hex):', toHex(bytes, true));
    }
}
