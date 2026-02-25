import fs from 'fs';

import { parseToAST } from '../src/backend/asm/parser.ts';
import { assemble } from '../src/backend/asm/assembler.ts';

function main(): void {
  const args = process.argv.slice(2);

  if (![1, 2].includes(args.length)) {
    console.error('Usage: npm run assemble <assembly_file.s> [--trace]');
    console.error('Example: npm run assemble input.s');
    process.exit(1);
  }

  const [inputFile, ...rest] = args;
  const parserTrace = rest.includes('--trace');
  const asmCode: string = fs.readFileSync(inputFile, 'utf-8');

  try {
    const machineCode = assemble(asmCode);
    console.log(machineCode.map(code => code.toString(16).padStart(2, '0')).join(' '));
  }
  catch (error) {
    console.error('Assemble error:', (error as Error).stack);
  }
}

main();
