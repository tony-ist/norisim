import fs from 'fs';

import { assemble, parseToAST } from '../src/backend/asm/parser.ts';

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
    const ast = parseToAST(asmCode);
    console.log(JSON.stringify(ast, null, 2));
  } catch (error) {
    console.error('Parse to AST error:', (error as Error).message);
  }

  try {
    const bytes = assemble(asmCode, parserTrace);
    console.log(bytes);
  } catch (error) {
    console.error('Assembly error:', (error as Error).message);
  }
}

main(); 