import { Box, SvgIcon, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import codeSlice, { setSourceCode } from '../../store/slices/codeSlice';
import { RootState } from '../../store';
import { IR, IRNode, Operand } from '../../../backend/types/asm.types';
import sampleCode from '../../../backend/asm/programs/collatz.s?raw';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './CodeEditor.module.css';
import { toHexWord } from '../../../util/asm-util';

export function CodeEditor() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const ir: IR | null = useAppSelector((state: RootState) => state.simulator.ir);
  const noriSimulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);

  useEffect(() => {
    dispatch(setSourceCode(sampleCode));
  }, []);

  function setCode(code: string) {
    dispatch(setSourceCode(code));
  }

  if (ir && noriSimulatorState) {
    return (
      <Box className={styles.compiledCodeContainer}>
        {
          ir.map((node: IRNode) => (
            <Box key={node.address.toString()} className={styles.codeLineContainer}>
              {
                noriSimulatorState.currentAddress === node.address ? <ArrowForwardIcon /> : <Box width={24} />
              }
              {
                prettyPrintIRNode(node)
              }
            </Box>
          ),
          )
        }
      </Box>
    );
  }

  return (
    <TextField
      label="Code Editor"
      value={sourceCode}
      onChange={textArea => setCode(textArea.target.value)}
      multiline
      fullWidth
    />
  );
}

function prettyPrintIRNode(node: IRNode) {
  const label = node.label ? `${node.label}: ` : '';
  const hexAddress = toHexWord(node.address);
  const flag = node.forceUpdateFlags ? '.F' : '';
  return `${hexAddress} ${label}${node.mnemonic}${flag} ${node.operands.map((operand: Operand) => prettyPrintOperand(operand)).join(', ')}`;
}

function prettyPrintOperand(operand: Operand) {
  switch (operand.type) {
    case 'register':
      return `R${operand.value}`;
    default:
      return operand.value;
  }
}
