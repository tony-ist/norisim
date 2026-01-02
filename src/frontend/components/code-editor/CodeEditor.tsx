import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { githubLight } from '@uiw/codemirror-theme-github';
import { useCallback, useEffect } from 'react';
import sampleCode from '../../../backend/asm/programs/bubble-sort.s?raw';
import { IRNode, Operand } from '../../../backend/types/asm.types';
import { toHexWord } from '../../../util/asm-util';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSourceCode } from '../../store/slices/codeSlice';
import { nori } from './nori-language';
import styles from './CodeEditor.module.css';

export function CodeEditor() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const noriSimulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);

  useEffect(() => {
    dispatch(setSourceCode(sampleCode));
  }, []);

  const handleChange = useCallback((value: string) => {
    dispatch(setSourceCode(value));
  }, [dispatch]);

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
                    <span className={styles.label}>{prettyPrintLabel(node.label!)}</span>
                  </Box>
                )}
                <Box className={`${styles.codeLineContainer} ${styles.instructionLine}`}>
                  {isCurrentAddress ? <ArrowForwardIcon className={styles.arrow} /> : <Box width={24} />}
                  <CompiledInstruction node={node} />
                </Box>
              </Box>
            );
          })
        }
      </Box>
    );
  }

  return (
    <CodeMirror
      value={sourceCode}
      height="calc(100vh - 200px)"
      theme={githubLight}
      extensions={nori}
      onChange={handleChange}
      className={styles.editor}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: false,
        closeBrackets: false,
        autocompletion: false,
        rectangularSelection: true,
        crosshairCursor: false,
        highlightSelectionMatches: true,
        searchKeymap: true,
      }}
    />
  );
}

function CompiledInstruction({ node }: { node: IRNode }) {
  const hexAddress = toHexWord(node.address);
  const flag = node.forceUpdateFlags ? '.F' : '';

  return (
    <span className={styles.compiledLine}>
      <span className={styles.address}>{hexAddress}</span>
      {' '}
      <span className={styles.mnemonic}>
        {node.mnemonic}
        {flag}
      </span>
      {' '}
      {node.operands.map((operand: Operand, index: number) => (
        <span key={index}>
          {index > 0 && <span className={styles.punctuation}>, </span>}
          <OperandSpan operand={operand} />
        </span>
      ))}
    </span>
  );
}

function OperandSpan({ operand }: { operand: Operand }) {
  switch (operand.type) {
    case 'register':
      return (
        <span className={styles.register}>
          R
          {operand.value}
        </span>
      );
    case 'label':
      return <span className={styles.label}>{operand.value}</span>;
    case 'immediate':
      return <span className={styles.number}>{operand.value}</span>;
  }
}

function prettyPrintLabel(label: string) {
  return `${label}:`;
}
