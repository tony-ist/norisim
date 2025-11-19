import fs from 'fs';

// Import the assembly functions
const { assembleLines } = await import('../src/asm/assemble.ts');
const { toHex } = await import('../src/asm/asm-util.ts');

function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: npm run assemble <assembly_file.s> <text_hex_file.hex>');
    console.error('Example: npm run assemble input.s output.hex');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;

  try {
    // Read the input assembly file
    const asmCode: string = fs.readFileSync(inputFile, 'utf-8');
    const asmLines: string[] = asmCode.split('\n');

    // Assemble the code
    const machineCode: number[] = assembleLines(asmLines);
    
    // Convert to hex format
    const hexBytes: string[] = toHex(machineCode);
    const hexOutput: string = hexBytes.join(' ');

    // Write the output
    fs.writeFileSync(outputFile, hexOutput);
    
    console.log(`Successfully assembled ${inputFile} to ${outputFile}`);
    console.log(`Output: ${hexOutput}`);
    console.log(`Saved to ${outputFile}`);
  } catch (error) {
    console.error('Assembly error:', (error as Error).message);
    process.exit(1);
  }
}

main(); 