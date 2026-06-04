// Program to test branches
lim r1, 0
.back jz .label
addi r1, 1
addi r1, 1
addi r1, 1
addi r1, 1
addi r1, 1
addi r1, 1
.label jnz .back
