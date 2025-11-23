import fs from 'fs';
import * as ohm from 'ohm-js';
import { preprocess } from './preprocessor';
import { AST, INSTRUCTIONS } from '../types/ast.types';

function parseRegister(register: string) {
    return parseInt(register[1]);
}

function parseAddress(address: string) {
    return address;
}

function parseImmediate(immediate: string) {
    return parseInt(immediate);
}

function parseMnemonic(mnemonic: string) {
    return mnemonic.toUpperCase();
}

export function assemble(code: string, parserTrace: boolean = false): number[] {
    const preprocessedCode = preprocess(code);
    const contents = fs.readFileSync('src/backend/asm/nori-v1.ohm', 'utf-8');
    const grammar = ohm.grammar(contents);

    const semantics = grammar.createSemantics();
    
    semantics.addOperation('compile', {
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

    if (parserTrace) {
        console.log('parserTrace')
        const traceResult = grammar.trace(preprocessedCode);
        console.log(traceResult.toString());
    }
    
    const matchResult = grammar.match(preprocessedCode);

    if (matchResult.succeeded()) {
        const bytes = semantics(matchResult).compile();
        return bytes;
    }

    throw new Error(`Failed to assemble: ${matchResult.message}`);
}

export function parseToAST(code: string): AST {
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
        
        instruction: (label, _space, instrX) => {
            const base = instrX.toAST();

            if (label.sourceString) {
                return { ...base, label: label.sourceString.trim() };
            }

            return base;
        },
    
        instructionX: (instrustion) => instrustion.toAST(),
    
        instructionA: (mnemonic, flagNode, _ws1, dest, _ws2, srcA, _ws3, srcB) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "A",
            updateFlags: flagNode.sourceString ? 1 : 0, 
            dest: parseRegister(dest.sourceString),
            srcA: parseRegister(srcA.sourceString),
            srcB: parseRegister(srcB.sourceString),
        }),
    
        instructionB: (mnemonic, flagNode, _ws1, dest, _ws2, src) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "B",
            updateFlags: flagNode.sourceString ? 0 : 1,  
            dest: parseRegister(dest.sourceString),
            src: parseRegister(src.sourceString),
        }),
    
        instructionC: (mnemonic, _ws1, address, _ws2, register) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "C",
            address: parseAddress(address.sourceString),
            register: parseRegister(register.sourceString),
        }),
    
        instructionD: (mnemonic, _ws1, register) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "D",
            register: parseRegister(register.sourceString),
        }),
    
        instructionI: (mnemonic, _ws1, register, _ws2, immediate) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "I",
            register: parseRegister(register.sourceString),
            immediate: parseImmediate(immediate.sourceString),
        }),
    
        instructionJ: (mnemonic, _ws1, targetLabel) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "J",
            targetLabel: targetLabel.sourceString,
        }),
    
        instructionZ: (mnemonic) => ({
            mnemonic: parseMnemonic(mnemonic.sourceString),
            format: "Z",
        }),
    
        data: (_db, _inlineSpace, _immediate, _sep, _immediate2) => null,

        _iter: (...children) => children.map(c => c.toAST()).filter(x => x !== null)
    })

    const matchResult = grammar.match(preprocessedCode);
    
    if (matchResult.succeeded()) {
        return semantics(matchResult).toAST();
    }

    throw new Error(`Failed to parse: ${matchResult.message}`);
}
