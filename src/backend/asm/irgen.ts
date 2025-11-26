import { AST, ASTNode, INSTRUCTIONS, IR, IRNode, OPERAND_TYPES } from "../types/asm.types"
import { createLabelMap } from "./label-map";

export function generateIR(ast: AST): IR {
    const result: IR = [];
    let address = 0;

    for (const astNode of ast) {
        const lines = convertASTNodeToIRNodes(astNode, address);
        result.push(...lines);
        address += lines.length;
    }

    return fillIRTargetAddresses(result);
}

function convertASTNodeToIRNodes(astNode: ASTNode, address: number): IRNode[] {
    const mnemonic = astNode.mnemonic;
    
    if (mnemonic === 'DB') {
        const result: IRNode[] = [];
        let dbAddress = address;
        
        for (const operand of astNode.operands) {
            if (operand.type === 'immediate') {
                result.push({
                    mnemonic: 'DB',
                    address: dbAddress,
                    value: operand.value,
                    label: astNode.label,
                });
                dbAddress += 1;
            } else {
                throw new Error(`Invalid operand type for DB instruction: ${operand.type}`);
            }
        }

        return result;
    }

    validateOperandTypes(astNode);

    return [convertASTInstructionToIRNode(astNode, address)];
}

function convertASTInstructionToIRNode(astNode: ASTNode, address: number): IRNode {
    if (astNode.mnemonic === 'DB') {
        throw new Error(`DB instruction is not allowed in IR generation. Use convertASTDataToIRNode instead.`);
    }
    
    const mnemonic = astNode.mnemonic;

    const info = INSTRUCTIONS[mnemonic as keyof typeof INSTRUCTIONS];

    if (!info) {
        throw new Error(`Invalid instruction: ${mnemonic}`);
    }

    switch (info.format) {
        case 'Z':
            return {
                mnemonic,
                address,
                format: info.format,
                label: astNode.label,
            };
        case 'J':
            const targetLabel = astNode.operands[0].value as string;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                targetLabel,
                label: astNode.label,
            };
        case 'A':
            const destRegister = astNode.operands[0].value as number;
            const srcRegisterA = astNode.operands[1].value as number;
            const srcRegisterB = astNode.operands[2].value as number;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                srcRegisterA,
                srcRegisterB,
                destRegister,
                updateFlags: astNode.forceUpdateFlags,
                label: astNode.label,
            };
        case 'B':
            const register1 = astNode.operands[0].value as number;
            const register2 = astNode.operands[1].value as number;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                register1,
                register2,
                updateFlags: astNode.forceUpdateFlags,
                label: astNode.label,
            };
        case 'C':
            const portAddress = astNode.operands[0].value as number;
            const registerC = astNode.operands[1].value as number;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                portAddress,
                register: registerC,
                label: astNode.label,
            };
        case 'D':
            const registerD = astNode.operands[0].value as number;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                register: registerD,
                label: astNode.label,
            };
        case 'I':
            const registerI = astNode.operands[0].value as number;
            const immediate = astNode.operands[1].value as number;

            return {
                mnemonic: mnemonic,
                address,
                format: info.format,
                register: registerI,
                immediate,
                label: astNode.label,
            };
        default:
            throw new Error(`Invalid format for AST node: ${astNode}`);
    }
}

function validateOperandTypes(astNode: ASTNode) {
    const format = INSTRUCTIONS[astNode.mnemonic as keyof typeof INSTRUCTIONS].format;

    if (astNode.operands.length !== OPERAND_TYPES[format].length) {
        throw new Error(`Invalid number of operands for ${astNode.mnemonic} instruction: ${astNode.operands.length}`);
    }

    for (let i = 0; i < astNode.operands.length; i++) {
        const operand = astNode.operands[i];
        const expectedType = OPERAND_TYPES[format][i];
        if (operand.type !== expectedType) {
            throw new Error(`Invalid operand type for ${astNode.mnemonic} instruction: ${operand.type}. Expected ${expectedType}.`);
        }
    }
}

function fillIRTargetAddresses(ir: IR): IR {
    const result: IR = [];
    const labelMap = createLabelMap(ir);

    for (const irNode of ir) {
        if (irNode.mnemonic === 'DB') {
            result.push(irNode);

            continue;
        }

        if (irNode.format === 'J') {
            const targetLabel = irNode.targetLabel;
            const targetAddress = labelMap.get(targetLabel);

            if (!targetAddress) {
                throw new Error(`Target label for J instruction ${irNode.mnemonic} not found: ${targetLabel}`);
            }

            result.push({
                ...irNode,
                targetAddress,
            });

            continue;
        }

        result.push(irNode);
    }

    return result;
}
