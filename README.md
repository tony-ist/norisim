# Nori Minecraft CPU Simulator and Assembler

This project is a browser-based assembler and emulator scaffold for the NORI Minecraft CPU.

ISA and specs can be found here: https://docs.google.com/spreadsheets/d/1BPdxBNG6HjZoDJEjPB8a9FUnWrcgYWiH5zjMcJJQ3L8/edit?usp=sharing

## Usage

### Install dependencies
```bash
npm install
```

### Run web app

```bash
npm run dev
```

### Assemble from command line
```bash
npm run assemble path/to/assembly.s path/to/output.hex
```

### Test
```bash
npm run test
```

### Generate ROM schematic 

```bash
uv run scripts/romgen.py src/backend/asm/programs/compiled/fib.txt
```

## TODO
- Display 
- Text output device
- Test overflowing values are masked and correctly stored in registers
- Page aligning in assembly
- Make AND, OR, NAND, NOR and such pseudoinstructions. Call internal real instruction ADDINT with argument of negate flag (and maybe update flags flag too)

### UI Components
- Program memory hex view
- RAM hex view
- Stack hex view
- Registers (R1-R7, PC)
- Flags
- Ports

