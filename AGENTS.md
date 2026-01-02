# AGENTS.md - AI Agent Guidelines for Nori CPU Simulator

## Project Overview

**Nori CPU Simulator** is a browser-based assembler and emulator for the NORI Minecraft CPU. It provides:
- A code editor with syntax highlighting for Nori assembly language
- An assembler that compiles assembly to intermediate representation (IR)
- A step-by-step CPU simulator with full register/memory/flag visualization
- Command-line assembly tools

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript (ES2020, strict mode) |
| Frontend | React 19, Redux Toolkit, MUI Material, CodeMirror |
| Build | Vite 4 |
| Testing | Vitest |
| Linting | ESLint 9 + @stylistic/eslint-plugin |
| Parser | Ohm.js (PEG grammar) |
| Node | 25.2.1 |

## Directory Structure

```
src/
├── backend/                  # Core assembler and simulator logic
│   ├── asm/                  # Assembler pipeline
│   │   ├── nori-v1.ohm       # Ohm grammar for Nori ISA
│   │   ├── parser.ts         # Ohm-based parser → AST
│   │   ├── preprocessor.ts   # Code preprocessing
│   │   ├── irgen.ts          # AST → IR (intermediate representation)
│   │   ├── label-map.ts      # Label resolution for jumps
│   │   └── programs/         # Sample assembly programs (.s files)
│   ├── simulator/
│   │   └── norisim-step.ts   # CPU simulator state machine
│   └── types/
│       └── asm.types.ts      # Type definitions (AST, IR, opcodes)
├── frontend/
│   ├── App.tsx               # Root component
│   ├── components/           # UI components (each in own folder with .tsx + .module.css)
│   │   ├── code-editor/      # CodeMirror-based editor
│   │   ├── controls/         # Simulator control buttons
│   │   ├── state-viewer/     # CPU state visualization
│   │   ├── reg-viewer/       # Register display
│   │   ├── flags-viewer/     # CPU flags display
│   │   ├── ram-viewer/       # RAM hex view
│   │   ├── ports-viewer/     # I/O ports display
│   │   └── ...
│   ├── store/                # Redux store
│   │   ├── index.ts          # Store configuration
│   │   ├── hooks.ts          # Typed hooks (useAppDispatch, useAppSelector)
│   │   └── slices/           # Redux slices (simulatorSlice, codeSlice)
│   └── utils/                # Frontend utilities
├── const/
│   └── simulator-constants.ts # CPU architecture constants
├── util/                     # Shared utilities with tests
│   ├── asm-util.ts
│   └── *.test.ts
├── main.tsx                  # React entry point
└── index.css                 # Global styles
```

## Key Architectural Patterns

### 1. Assembler Pipeline

```
Source Code (.s) → Preprocessor → Parser (Ohm) → AST → IR Generator → IR
```

- **AST (Abstract Syntax Tree)**: Includes pseudo-instructions like `INC`, `DEC`
- **IR (Intermediate Representation)**: Only real instructions with resolved addresses
- All instruction formats (A, B, C, I, J, Z) defined in `asm.types.ts`

### 2. Simulator State

The simulator uses immutable state updates. Key state interface:

```typescript
interface NoriSimulatorState {
  ir: IR                    // Compiled program
  currentAddress: number    // Program counter
  registers: number[]       // R0-R7 (R0 always 0)
  ZF, CF, VF, NF: boolean   // CPU flags
  RAM: number[]             // 256 bytes
  PMEM: number[]            // Program memory (2048 bytes)
  stack: number[]           // 64 bytes
  inputPorts: number[]      // 8 input ports
  outputPorts: number[]     // 8 output ports
  cycle: number             // Execution cycle counter
}
```

### 3. Redux State Management

Two slices:
- **codeSlice**: Source code string
- **simulatorSlice**: Simulator state, errors, run/pause state

Use typed hooks from `store/hooks.ts`:
```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
```

### 4. Component Pattern

Each component has its own folder:
```
component-name/
├── ComponentName.tsx
└── ComponentName.module.css
```

Components connect to Redux store, receive data via selectors, dispatch actions.

## Nori ISA Reference

### Instruction Formats

| Format | Description | Operands |
|--------|-------------|----------|
| A | 3-register ops | dest, srcA, srcB |
| B | 2-register ops | dest, src |
| C | 1-register ops | reg |
| I | Immediate ops | reg, imm8 |
| J | Jump ops | label |
| Z | No operands | - |

### Real Instructions

```
NOP, LIM, ADDI, ADD, SUB, AND, NAND, OR, NOR, XOR, XNOR, NOT, SHR, MOV
JMP, JZ, JNZ, JC, JNC, JL, JG, JLE, JGE
CAL, RET, PSH, POP
MLD, MST, PST, PLD
HLT
```

### Pseudo Instructions

- `INC reg` → `ADDI reg, 1`
- `DEC reg` → `ADDI reg, -1`

### Assembly Syntax

```asm
.label_name mnemonic.f operand1, operand2  // inline comment
```

- Labels start with `.`
- `.f` suffix forces flag update
- Comments with `//`
- Registers: `R0`-`R7`
- Immediates: signed 8-bit (-128 to 127)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build
npm run test         # Run Vitest tests
npm run test:watch   # Watch mode tests
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run tscheck      # TypeScript type check only
npm run assemble <input.s> <output.hex>  # CLI assembler
```

## Code Style & Conventions

### TypeScript

- Strict mode enabled
- Use `satisfies` for type-safe object literals
- Prefer `const` arrays with `as const` for literal types
- Always add explicit return types on exported functions

### ESLint Rules

- Semicolons required (`@stylistic/semi: error`)
- React import not required (React 17+ JSX transform)
- Unused vars are warnings, not errors

### Naming Conventions

- **Files**: kebab-case (`simulator-constants.ts`)
- **Components**: PascalCase (`CodeEditor.tsx`)
- **CSS Modules**: kebab-case (`.code-line-container`)
- **Types/Interfaces**: PascalCase (`NoriSimulatorState`)
- **Constants**: SCREAMING_SNAKE_CASE (`PMEM_SIZE_BYTES`)

### Commit Conventions

ALWAYS use conventional commits in the format `feat/fix/chore: description`