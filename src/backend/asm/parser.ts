import fs from 'fs';
import * as ohm from 'ohm-js';
import * as extra from 'ohm-js/extras';

export function parse(code: string) {
    // const contents = fs.readFileSync('src/backend/asm/nori-v1.ohm', 'utf-8');
    const contents = fs.readFileSync('src/backend/asm/nori-v1-lexical.ohm', 'utf-8');
    const grammar = ohm.grammar(contents);
    
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
            instructionLine: {
                instruction: 0
            },
            instruction: {
                label: 0,
                mnemonic: 2,
                operands: 4
            },
            operands: (first: any, _sep: any, rest: any): any[] => {
                return [first.toAST(mapping), ...rest.toAST(mapping)];
            },
        };

        const ast = extra.toAST(matchResult, mapping);
        console.log(JSON.stringify(ast, null, 2));
    }
}
