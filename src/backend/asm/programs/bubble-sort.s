lim r1, 0
lim r2, 12
mst r1, r2

inc r1
lim r2, 42
mst r1, r2

inc r1
lim r2, 127
mst r1, r2

inc r1
lim r2, 30
mst r1, r2

inc r1
lim r2, 76
mst r1, r2

inc r1
lim r2, 5
mst r1, r2

inc r1
lim r2, 18
mst r1, r2

inc r1
lim r2, 3
mst r1, r2

pld r2, 0

lim r2, 8 // array length
dec r2

.outer_loop
    lim r1, 0 // r1 = i
    lim r7, 0 // has any swap occured in inner_loop?

    .inner_loop
        mov r3, r1
        inc r3 // r3 = i + 1
        mld r1, r4
        mld r3, r5
        sub.f r0, r4, r5
        jge .inner_loop_end
  
        .swap
        mst r1, r5
        mst r3, r4
        lim r7, 1

        .inner_loop_end
        inc r1
        sub.f r0, r1, r2
        jl .inner_loop
        
    addi r7, 0 // test if any swap occured
    jnz .outer_loop

hlt
