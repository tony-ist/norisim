import fs from 'fs';

import { parseToAST } from '../src/backend/asm/parser.ts';
import { generateIR } from '../src/backend/asm/irgen.ts';

function main(): void {
  const args = process.argv.slice(2);
  
  if (![1, 2].includes(args.length)) {
    console.error('Usage: npm run rnd <assembly_file.s> [--trace]');
    console.error('Example: npm run rnd input.s');
    process.exit(1);
  }

  const [inputFile, ...rest] = args;
  const parserTrace = rest.includes('--trace');
  const asmCode: string = fs.readFileSync(inputFile, 'utf-8');

  try {
    const ast = parseToAST(asmCode, parserTrace);
    console.log('AST:', JSON.stringify(ast, null, 2));
    const ir = generateIR(ast);
    console.log('IR:', JSON.stringify(ir, null, 2));
  } catch (error) {
    console.error('RND script error:', (error as Error).stack);
  }
}

main();
