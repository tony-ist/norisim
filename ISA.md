# Nori CPU ISA

This document describes the NORI CPU instruction set.

## Word and Field Conventions

- Instruction width: 16 bits (`bit 15` = MSB, `bit 0` = LSB)
- Opcode width: 5 bits (`bits 4..0`)
- Register fields: 3 bits (values `0..7`, commonly `R0..R7`)
- Immediate field (`IMM`): 8 bits
- Jump address field (`ROM ADDRESS`): 11 bits
- Branch field (`BRC`): `COND[2:0] PAGE[2:0] ADDRESS[2:0]`

## Bit Layouts

### Immediate Format (LIM / ADDI / ANDI)

```
bits 15..8   7..5  4..0
     IMM     REG   OPCODE
```

### ALU 3-Register Format (ADD / SUB / AND / OR / XOR family)

```
bits 15 14 13..11 10..8 7..5 4..0
      F  N  A      B     DEST OPCODE
```

- `F`: update flags when set
- `N`: logic inversion control (used by AND/OR/XOR families; fixed `0` for ADD/SUB)

### Shift Format (SHR)

```
bits 15 14 13..11 10..8 7..5 4..0
      F  0  SRC    000   DEST OPCODE
```

### Branch Format (BRC)

```
bits 15 14 13..11 10..8 7..5 4..0
      0  0  COND   PAGE  ADDR OPCODE
```

### Absolute Jump/Call Format (JMP / CAL)

```
bits 15..5            4..0
     ROM_ADDRESS      OPCODE
```

### Stack / RAM / Port Formats

#### PSH

```
bits 15..14 13..11 10..5  4..0
     00     SRC    000000 OPCODE
```

#### POP

```
bits 15..8    7..5 4..0
     00000000 DEST OPCODE
```

#### MLD

```
bits 15..11 10..8 7..5 4..0
     00000  PTR   DEST OPCODE
```

#### MST

```
bits 15..14 13..11 10..8 7..5 4..0
     00     SRC    PTR   000  OPCODE
```

#### PST

```
bits 15..14 13..11 10..8 7..5 4..0
     00     SRC    PORT  000  OPCODE
```

#### PLD

```
bits 15..11 10..8 7..5 4..0
     00000  PORT  DEST OPCODE
```

## Opcode Table

| # | Hex | Opcode (bin) | Mnemonic | Description | Example |
|---|---:|---|---|---|---|
| 0 | `00` | `00000` | `NOP` | No operation | `nop` |
| 1 | `01` | `00001` | `LIM` | Load immediate in `DEST` register | `lim r1, 5` |
| 2 | `02` | `00010` | `ADDI` | Add immediate to `REG`, store in `REG`, update flags | `addi r1, 5` |
| 3 | `03` | `00011` | `ANDI` | AND immediate and `REG`, store in `REG`, update flags | `andi r1, 5` |
| 4 | `04` | `00100` | `ADD` | Add `A` and `B`, store in `DEST` | `add dest, r1, r2` |
| 5 | `05` | `00101` | `SUB` | `DEST = A - B` | `sub dest, r1, r2` |
| 6 | `06` | `00110` | `AND` | `DEST = A (N)AND B` | `and.f dest, r1, r2` |
| 7 | `07` | `00111` | `OR` | `DEST = A (N)OR B` | `or dest, r1, r2` |
| 8 | `08` | `01000` | `XOR` | `DEST = A X(N)OR B` | `xor dest, r1, r2` |
| 9 | `09` | `01001` | `SHR` | `DEST = SRC >> 1` | `shr dest, src` |
| 10 | `0A` | `01010` | `BRC` | Conditional branch within the page | `brc 1, .label` |
| 11 | `0B` | `01011` | `JMP` | Unconditionally jump to absolute 11-bit address in ROM | `jmp .label` |
| 12 | `0C` | `01100` | `CAL` | Push `SR`, then `PC + 2` to stack; jump to ROM address | `cal proc` |
| 13 | `0D` | `01101` | `RET` | Pop address (2 bytes) from stack to `SR/PC` | `ret` |
| 14 | `0E` | `01110` | `PSH` | Push `SRC` register to stack | `psh src` |
| 15 | `0F` | `01111` | `POP` | Pop byte from stack to `DEST` | `pop dest` |
| 16 | `10` | `10000` | `MLD` | Load byte from RAM by `PTR` register into `DEST` register | `mld dest, ptr` |
| 17 | `11` | `10001` | `MST` | Store byte from `SRC` register to RAM by `PTR` register | `mst src, ptr` |
| 18 | `12` | `10010` | `PST` | Output byte from `SRC` register to port | `pst r2, 1` |
| 19 | `13` | `10011` | `PLD` | Input byte from port to `DEST`, halt CPU until input, update flags | `pld r2, 1` |
| 20 | `14` | `10100` | `HLT` | Halt the CPU | `hlt` |

## Notes

- Logic-family rows use `N` to select normal/inverted behavior (for example AND vs NAND).
- `.f` in examples indicates forcing flag updates for supported ALU instructions.
