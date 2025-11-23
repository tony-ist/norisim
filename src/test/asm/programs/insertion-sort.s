// Copy .data to RAM, and insertion sort it 

.data
    db 170, 45, 75, 90, 2, 66, 80, 33, 11, 24, 99, 58

lim r1, 0 // Address of data in ROM and RAM
lim r2, 12 // Array size

.copy_loop
    lpm r1, r3
    mst r1, r3
    addi r1, 1
    sub.f r0, r1, r2
    jnz .copy_loop

// TODO: Sort

hlt