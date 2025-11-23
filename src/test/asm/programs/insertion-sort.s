    // Written by Grok 4.1, modified by Tony

    // ==================== ROM DATA ====================
    .array_len
    db 12                          // array length N
    .data
    db 170, 45, 75, 90, 2, 66, 80, 33, 11, 24, 99, 58
    // change N and the list above only

    // ==================== PROGRAM ====================

    // Copy N from ROM[0x00] → RAM[0x0F]
.start
    lim r1, 0
    lpm r2, r1
    mst 15, r2

    // Copy array ROM[0x01…] → RAM[0x10…]
    lim r1, 1                 // source pointer in ROM
    lim r2, 2                  // destination pointer in RAM
    lim r3, 12                     // byte counter (must match N)

.copy_loop
    lpm r4, r1
    mst r2, r4
    addi r1, 1                     // src++
    addi r2, 1                     // dst++
    addi r3, 255                     // counter--  (subi = addi with 255, but here we use literal 1)
    jnz .copy_loop

    // Start insertion sort
    lim r1, 1                      // i = 1
    mld r5, 15                   // r5 = N

.outer_loop
    sub.f r5, r5, r1               // r5 = N - i, update flags
    jle .done                      // if i >= N → finished

    // key = array[i]
    lim r4, 2
    add r4, r4, r1
    mld r3, r4                     // r3 = key

    mov r2, r1
    addi r2, 255                     // j = i - 1

    // check j < 0 (j == -1 → adding 1 gives carry)
.inner_loop
    add.f r0, r2, r1               // r1 currently holds i ≥1 → we reuse it as +1
    jc .place_key                  // carry set → j was 0xFF

    lim r4, 2
    add r4, r4, r2
    mld r5, r4                     // r5 = array[j]

    sub.f r5, r5, r3               // compare array[j] > key
    jle .place_key                 // ≤ key → stop shifting

    addi r4, 1
    mst r4, r5                     // array[j+1] = array[j]

    addi r2, 255                     // j--
    jmp .inner_loop

.place_key
    lim r4, 2
    add r4, r4, r2
    addi r4, 1                     // r4 = address of array[j+1]
    mst r4, r3                     // store key

    addi r1, 1                     // i++
    jmp .outer_loop

.done
    hlt                            // sorting complete!