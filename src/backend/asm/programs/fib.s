// Calculates fibonacci, does r1 iterations

lim 5 // iterations
str r1
lim 1
str r2
lim 1
str r3

.loop
    // r2 += r3
    ldr r2
    add r3
    str r2

    // swap(r2, r3)
    ldr r2
    str r4
    ldr r3
    str r2
    ldr r4
    str r3

    // r1 -= 1
    ldr r1
    dec
    str r1

    jnz .loop

hlt
