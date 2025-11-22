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

## TODO
- Linting

### UI Components
- **Program memory hex view**
- **RAM hex view**
- **Stack hex view**
- **Registers (R1-R4, PC)**
- **Flags**
- **Ports**
- **Display**
- Console (Not implemented)