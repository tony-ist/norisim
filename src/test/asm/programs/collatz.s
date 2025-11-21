// Calculates collatz conjecture for value in r1

lim r1, 3
lim r2, 1

.loop
    sub r0, r1, r2
    jz .hlt
    and.f r0, r1, r2
    jz .even
.odd
    mov r3, r1
    add r1, r1, r3
    add r1, r1, r3
    addi r1, 1
    jmp .loop
.even
    shr r1, r1
    jmp .loop

.hlt
pst 1, r1 // Notify that we are finished
hlt
