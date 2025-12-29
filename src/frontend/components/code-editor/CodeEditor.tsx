import { Box, SvgIcon, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import codeSlice, { setSourceCode } from '../../store/slices/codeSlice';
import { RootState } from '../../store';
import { IR, IRNode, Operand } from '../../../backend/types/asm.types';
import sampleCode from '../../../backend/asm/programs/bubble-sort.s?raw';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './CodeEditor.module.css';
import { toHexWord } from '../../../util/asm-util';

export function CodeEditor() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const noriSimulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);

  useEffect(() => {
    dispatch(setSourceCode(sampleCode));
  }, []);

  function setCode(code: string) {
    dispatch(setSourceCode(code));
  }

  if (noriSimulatorState) {
    return (
      <Box className={styles.compiledCodeContainer}>
        {
          noriSimulatorState.ir.map((node: IRNode) => {
            const hasLabel = !!node.label;
            const isCurrentAddress = noriSimulatorState.currentAddress === node.address;

            return (
              <Box key={node.address.toString()}>
                {hasLabel && (
                  <Box className={styles.codeLineContainer}>
                    <Box width={24} />
                    {prettyPrintLabel(node.label!)}
                  </Box>
                )}
                <Box className={`${styles.codeLineContainer} ${styles.instructionLine}`}>
                  {isCurrentAddress ? <ArrowForwardIcon /> : <Box width={24} />}
                  {prettyPrintIRNode(node)}
                </Box>
              </Box>
            );
          })
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

function prettyPrintLabel(label: string) {
  return `${label}:`;
}

function prettyPrintIRNode(node: IRNode) {
  const hexAddress = toHexWord(node.address);
  const flag = node.forceUpdateFlags ? '.F' : '';
  return `${hexAddress} ${node.mnemonic}${flag} ${node.operands.map((operand: Operand) => prettyPrintOperand(operand)).join(', ')}`;
}

function prettyPrintOperand(operand: Operand) {
  switch (operand.type) {
    case 'register':
      return `R${operand.value}`;
    default:
      return operand.value;
  }
}
