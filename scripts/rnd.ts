import fs from 'fs';

import { toHex } from '../src/util/asm-util.ts';
import { parse } from '../src/backend/asm/parser.ts';

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.error('Usage: npm run rnd <assembly_file.s>');
    console.error('Example: npm run rnd input.s');
    process.exit(1);
  }

  const [inputFile] = args;

  try {
    const asmCode: string = fs.readFileSync(inputFile, 'utf-8');
    
    parse(asmCode);
  } catch (error) {
    console.error('Assembly error:', (error as Error).message);
    process.exit(1);
  }
}

main(); 