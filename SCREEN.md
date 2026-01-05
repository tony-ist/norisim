# Screen Protocol

The Nori CPU communicates with a 32×32 pixel screen via I/O ports.

## Overview

- **Resolution**: 32×32 pixels
- **Coordinate System**: Origin (0, 0) at bottom-left, (31, 31) at top-right
- **Axes**: X = horizontal, Y = vertical
- **Operation Size**: 2 bytes per command

## Command Format

Each screen operation is encoded as a 16-bit value:

```
┌──────────┬───────────┬───────────┐
│  opcode  │     Y     │     X     │
│  6 bits  │  5 bits   │  5 bits   │
└──────────┴───────────┴───────────┘
 bits 15-10  bits 9-5    bits 4-0
```

**Binary layout example**: `0b000000_00011_00101`
- Opcode: `000000` (0) = write pixel
- Y: `00011` (3)
- X: `00101` (5)
- Result: Write pixel at coordinates (5, 3)

## Opcodes

| Opcode | Name              | Description                              |
|--------|-------------------|------------------------------------------|
| 0      | Write Pixel       | Set pixel at (X, Y) in the buffer        |
| 1      | Clear Pixel       | Clear pixel at (X, Y) in the buffer      |
| 2      | Draw Buffer       | Render the buffer to the screen          |
| 3      | Clear Buffer      | Clear the entire buffer                  |
| 4-63   | *Reserved*        | TODO                                     |

## Triggering Operations

To execute a screen command, output 2 bytes sequentially to the port connected to the screen:

1. Output the **high byte** (bits 15-8) first
2. Output the **low byte** (bits 7-0) second

The screen processes the command after receiving both bytes.

## Examples

### Write a pixel at (10, 20)

```
Opcode: 0 (write pixel)
Y: 20 = 0b10100
X: 10 = 0b01010

Command: 0b000000_10100_01010 = 0x028A
High byte: 0x02
Low byte: 0x8A
```

### Clear the buffer

```
Opcode: 3 (clear buffer)
Y: 0 (ignored)
X: 0 (ignored)

Command: 0b000011_00000_00000 = 0x0C00
High byte: 0x0C
Low byte: 0x00
```

### Draw the buffer to screen

```
Opcode: 2 (draw buffer)
Y: 0 (ignored)
X: 0 (ignored)

Command: 0b000010_00000_00000 = 0x0800
High byte: 0x08
Low byte: 0x00
```

