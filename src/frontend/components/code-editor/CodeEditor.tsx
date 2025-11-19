import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { SvgIcon } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React from 'react';
import { AsmLine } from '../../asm/AsmLine.ts';
import { toHex } from '../../asm/asm-util.ts';
import styles from './CodeEditor.module.css';

interface CodeEditorPropsType {
  isEditing: boolean;
  asmLines?: AsmLine[];
  currentLineIndex?: number;
  asmCode: string;
  setAsmCode: (asmCode: string) => void;
}

function prettyPrintAsmLine(asmLine: AsmLine) {
  const aliasMnemonic = asmLine.getAliasMnemonic();
  const aliasOperands = asmLine.getAliasOperands();
  const mnemonic = aliasMnemonic === undefined ? asmLine.getMnemonic() : aliasMnemonic;
  const operands = aliasOperands === undefined ? asmLine.getOperands() : aliasOperands;
  const operandStrings = operands.map((operand) => operand.toString()).join(' ');
  const offset = asmLine.getOffsetInBytes();
  if (offset === undefined) {
    throw new Error(`Offset in bytes is undefined for line ${asmLine.toString()}`);
  }
  return `${toHex([offset])}: ${mnemonic} ${operandStrings}`;
}

export function CodeEditor(props: CodeEditorPropsType) {
  const { isEditing, asmLines, currentLineIndex, asmCode, setAsmCode } = props;

  if (!isEditing && !asmLines) {
    throw new Error(`Invalid CodeEditor state: isEditing: "${isEditing}" and asmLines: "${asmLines}"`);
  }

  return (
    <Box>
      {
        isEditing &&
        <TextField
          className={styles.textAreaContainer}
          label='ASM Code'
          value={asmCode}
          onChange={(textArea) => setAsmCode(textArea.target.value)}
          multiline
          fullWidth
          // This forces it to read styles from css
          inputProps={{ style: { overflow: '', height: '' } }}
        />
      }
      {
        !isEditing &&
        <Box className={styles.compiledCodeContainer}>
          <Box>
            {
              asmLines &&
              asmLines.map((asmLine, index) =>
                <Box
                  key={index}
                  sx={{ position: 'relative' }}
                >
                  {
                    asmLine.getLabel() &&
                    <Box>{ asmLine.getLabel() }</Box>
                  }
                  <SvgIcon
                    sx={{
                      position: 'absolute',
                      marginLeft: 5,
                      visibility: currentLineIndex === index ? 'visible' : 'hidden'
                    }}
                    component={ArrowForwardIcon}
                  />
                  <Box key={index} sx={{ marginLeft: 10 }}>
                    { prettyPrintAsmLine(asmLine) }
                  </Box>
                </Box>
              )
            }
          </Box>
        </Box>
      }
    </Box>
  );
}