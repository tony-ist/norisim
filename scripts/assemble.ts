import fs from 'fs';

import { assemble } from '../src/backend/asm/assembler.ts';

function main(): void {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error('Usage: npm run assemble <assembly_file.s>');
    console.error('Example: npm run assemble programs/prog.s');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = inputFile.replace(/\.s$/, '.hex');

  if (outputFile === inputFile) {
    console.error('Input file must have a .s extension');
    process.exit(1);
  }

  const asmCode: string = fs.readFileSync(inputFile, 'utf-8');

  try {
    const machineCode = assemble(asmCode);
    const hexStr = machineCode.map(code => code.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    fs.writeFileSync(outputFile, hexStr + '\n', 'utf-8');
    console.log(`Assembled ${inputFile} → ${outputFile}`);
  }
  catch (error) {
    console.error('Assemble error:', (error as Error).stack);
    process.exit(1);
  }
}

main();
