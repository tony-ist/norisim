export function generateIR(ast: AST): IR {
    return ast.map((instruction) => {
        return {
            mnemonic: instruction.mnemonic,
            operands: instruction.operands,
        }
    })
}