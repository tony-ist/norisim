import Box from '@mui/material/Box';
import styles from './EmulatorStateViewer.module.css';
import { toHex } from '../../asm/asm-util.ts';
import { PMemViewer } from '../pmem-viewer/PMemViewer.tsx';
import { RegViewer } from '../reg-viewer/RegViewer.tsx';
import { StackViewer } from '../stack-viewer/StackViewer.tsx';
import { FlagsViewer } from '../flags-viewer/FlagsViewer.tsx';
import { RamViewer } from '../ram-viewer/RamViewer.tsx';
import React from 'react';
import { NoriSimulatorState } from '../../../emulator/NoriSimulator.ts';
import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';
import { ScreenViewer } from '../screen-viewer/ScreenViewer.tsx';

interface EmulatorStatePropsType {
  emulatorState: NoriSimulatorState;
}

export function EmulatorStateViewer(props: EmulatorStatePropsType) {
  const { emulatorState } = props;
  const portLabels = ['P0', 'P1', 'P2', 'P3'];
  const inputPortColumns = [
    {
      label: 'P0',
      value: emulatorState.inputPorts[0],
    }
  ]
  const outputPortColumns = portLabels.map((label, index) => ({
    label,
    value: emulatorState.outputPorts[index],
  }));

  return (
    <Box className={styles.emulatorStateContainer}>
      <Box>Cycle (decimal): {emulatorState.cycle}</Box>
      <Box>PC (hex): {toHex([emulatorState.PC])}</Box>
      <Box>PC (binary): {emulatorState.PC.toString(2).padStart(8, '0')}</Box>
      {
        emulatorState.isScreenAttached &&
        <ScreenViewer
          pixels={emulatorState.screen}
        />
      }
      <PMemViewer
        machineCode={emulatorState.PMEM}
        highlightByte={emulatorState.PC}
        highlightSize={emulatorState.asmLines[emulatorState.lineIndex]?.getSizeInBytes()}
      />
      <RegViewer
        registers={emulatorState.registers}
      />
      <StackViewer
        binaryData={emulatorState.stack}
      />
      <FlagsViewer
        ZF={emulatorState.ZF}
        COUTF={emulatorState.COUTF}
        MSBF={emulatorState.MSBF}
        LSBF={emulatorState.LSBF}
      />
      <SimpleHexViewer
        title="Input Ports"
        columns={inputPortColumns}
      />
      <SimpleHexViewer
        title="Output Ports"
        columns={outputPortColumns}
      />
      <RamViewer
        binaryData={emulatorState.RAM}
      />
    </Box>
  );
}