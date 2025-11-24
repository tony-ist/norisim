.start
nop       
lim r1, 1
add r1, r2, r3
add.f r1, r2, r3
addi r1, 5
sub r1, r2, r3
sub.f r1, r2, r3
and r1, r2, r3
and.f r1, r2, r3
nand r1, r2, r3
nand.f r1, r2, r3
or r1, r2, r3
or.f r1, r2, r3
nor r1, r2, r3
nor.f r1, r2, r3
xor r1, r2, r3
xor.f r1, r2, r3
xnor r1, r2, r3
xnor.f r1, r2, r3
not r1, r2
not.f r1, r2
shr r1, r2
shr.f r1, r2
jmp .start
jz .start
jnz .start
jc .start
jnc .start
jl .start
jg .start
jle .start
jge .start
cal .start
ret
psh r1
pop r1
lpm r1, r2
mld r1, r2
mst r1, r2
mov r1, r2
pst r1, 1
pld r2, 2
hlt
db 12, 23, 34
