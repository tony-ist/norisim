// Program to test branch jnz 
.start lim r1, 0
jnz .label
addi r1, 1
jnz .label
addi r1, 1
jnz .label
addi r1, 1
addi r1, 1
.label jnz .start
