lim r1, 0 // left paddle top y coordinate
lim r2, 0 // right paddle
lim r3, 1 // ball x coord
lim r4, 1 // ball y coord

.draw
clearbuf
mov r5, r1
pxlr r0, r5
addi r5, 1
pxlr r0, r5
addi r5, 1
pxlr r0, r5

mov r5, r2
lim r6, 31
pxlr r6, r5
addi r5, 1
pxlr r6, r5
addi r5, 1
pxlr r6, r5

drawbuf

hlt