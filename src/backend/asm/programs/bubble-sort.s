lim r1, 0
lim r2, 8 // array length
mst r1, r2

inc r1
lim r2, 42
mst r1, r2

inc r1
lim r2, 219
mst r1, r2

inc r1
lim r2, 133
mst r1, r2

inc r1
lim r2, 76
mst r1, r2

inc r1
lim r2, 251
mst r1, r2

inc r1
lim r2, 18
mst r1, r2

inc r1
lim r2, 164
mst r1, r2

inc r1
lim r2, 187
mst r1, r2

mld r0, r2 // array length
dec r2
lim r1, 0 // r1 = i

.outer_loop
    mov r3, r1 // r3 = j
    inc r3

    .inner_loop
        mld r1, r4
        mld r3, r5
        sub.f r0, r1, r3
        jle .inner_loop_end

        // if arr[i] > arr[j]
        // swap arr[i] and arr[j]    
        .swap
        mst r1, r5
        mst r3, r4

        .inner_loop_end
        inc r3
        sub.f r0, r3, r2
        jnz .inner_loop
        
    inc r1
    sub.f r0, r1, r2
    jnz .outer_loop

hlt
