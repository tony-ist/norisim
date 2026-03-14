import fs from 'fs';

import { assemble } from '../src/backend/asm/assembler.ts';

function main(): void {
  const args = process.argv.slice(2);
  const binaryOutput = args.includes('-b') || args.includes('--binary');
  const positionalArgs = args.filter(arg => arg !== '-b' && arg !== '--binary');

  if (positionalArgs.length !== 1) {
    console.error('Usage: npm run assemble [--binary|-b] <assembly_file.s>');
    console.error('Example (hex): npm run assemble programs/prog.s');
    console.error('Example (binary): npm run assemble -- --binary programs/prog.s');
    process.exit(1);
  }

  const inputFile = positionalArgs[0];
  const outputFile = inputFile.replace(/\.s$/, binaryOutput ? '.bin' : '.hex');

  if (outputFile === inputFile) {
    console.error('Input file must have a .s extension');
    process.exit(1);
  }

  const asmCode: string = fs.readFileSync(inputFile, 'utf-8');

  try {
    const machineCode = assemble(asmCode);
    const output = binaryOutput ? toBinaryWords(machineCode) : toHexBytes(machineCode);
    fs.writeFileSync(outputFile, output + '\n', 'utf-8');
    console.log(`Assembled ${inputFile} → ${outputFile}`);
  }
  catch (error) {
    console.error('Assemble error:', (error as Error).stack);
    process.exit(1);
  }
}

function toHexBytes(machineCode: number[]): string {
  return machineCode.map(code => code.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

function toBinaryWords(machineCode: number[]): string {
  if (machineCode.length % 2 !== 0) {
    throw new Error(`Machine code length must be even, got ${machineCode.length} byte(s).`);
  }

  const words: string[] = [];

  for (let i = 0; i < machineCode.length; i += 2) {
    const highByte = machineCode[i].toString(2).padStart(8, '0');
    const lowByte = machineCode[i + 1].toString(2).padStart(8, '0');
    words.push(`${highByte} ${lowByte}`);
  }

  return words.join('\n');
}

main();
