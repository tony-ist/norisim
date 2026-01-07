// Screen test program
// Demonstrates screen operations: clear buffer, draw pixels, display
// Screen uses port 0, commands are 16-bit (high byte first, then low byte)
// Command format: 0bopcode(6)_Y(5)_X(5)
//   Opcode 0: Write pixel     - set pixel at (X, Y)
//   Opcode 1: Clear pixel     - clear pixel at (X, Y)
//   Opcode 2: Draw buffer     - render buffer to screen (0x0800)
//   Opcode 3: Clear buffer    - clear entire buffer (0x0C00)

// ==========================================
// Clear the buffer (opcode 3)
// Command: 0b000011_00000_00000 = 0x0C00
// ==========================================
lim r1, 12           // High byte: 0x0C
pst r1, 0            // Send high byte to port 0
lim r2, 0            // Low byte: 0x00
pst r2, 0            // Send low byte

// Draw pixels
pxl 1, 1

lim r1, 0
pst r0, 0
pst r1, 0

addi r1, 1
pst r0, 0
pst r1, 0

addi r1, 1
pst r0, 0
pst r1, 0

addi r1, 1
pst r0, 0
pst r1, 0

addi r1, 1
pst r0, 0
pst r1, 0

// 0b000000_00000_11111
// 0b000000_11111_00000
// 0b000000_11111_11111

pst r0, 0
lim r1, 0b0001_1111
pst r1, 0

lim r1, 0b0000_0011
pst r1, 0
lim r1, 0b1110_0000
pst r1, 0

lim r1, 0b0000_0011
pst r1, 0
lim r1, 0b1111_1111
pst r1, 0

// ==========================================
// Draw buffer to screen (opcode 2)
// Command: 0b0_00010_00000_00000 = 0x0800
// ==========================================
lim r1, 8            // High byte: 0x08
pst r1, 0
lim r2, 0            // Low byte: 0x00
pst r2, 0

hlt                  // Done!
