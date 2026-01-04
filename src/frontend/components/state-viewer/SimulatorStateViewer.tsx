import Box from '@mui/material/Box';
import { toHexWord } from '../../../util/asm-util.ts';
import { useAppSelector } from '../../store/hooks.ts';
import { RootState } from '../../store/index.ts';
import { FlagsViewer } from '../flags-viewer/FlagsViewer.tsx';
import { PMemViewer } from '../pmem-viewer/PMEMViewer.tsx';
import { PortsViewer } from '../ports-viewer/PortsViewer.tsx';
import { RamViewer } from '../ram-viewer/RamViewer.tsx';
import { RegViewer } from '../reg-viewer/RegViewer.tsx';
import { SimulatorError } from './SimulatorError.tsx';
import styles from './SimulatorStateViewer.module.css';

export function SimulatorStateViewer() {
  const simulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);
  const error = useAppSelector((state: RootState) => state.simulator.error);
  const errorStack = useAppSelector((state: RootState) => state.simulator.errorStack);

  if (errorStack) {
    console.error(errorStack);
  }

  if (!simulatorState) {
    return (
      <>
        {error && <SimulatorError error={error} />}
        <Box>No simulator initialized. Press Compile button.</Box>
      </>
    );
  }

  return (
    <>
      {error && <SimulatorError error={error} />}
      <Box className={styles.stateViewerContainer}>
        <Box>
          <strong>Cycle (decimal): </strong>
          {simulatorState.cycle}
        </Box>

        <Box>
          <strong>Current address (hex): </strong>
          {toHexWord(simulatorState.currentAddress)}
        </Box>

        <Box>
          <strong>Current address (binary): </strong>
          0b
          {simulatorState.currentAddress.toString(2).padStart(8, '0')}
        </Box>

        <RegViewer
          registers={simulatorState.registers}
        />

        <FlagsViewer
          ZF={simulatorState.ZF}
          CF={simulatorState.CF}
          NF={simulatorState.NF}
          VF={simulatorState.VF}
        />

        <PortsViewer
          inputPorts={simulatorState.inputPorts}
          outputPorts={simulatorState.outputPorts}
        />

        <RamViewer
          RAM={simulatorState.RAM}
        />

        <PMemViewer
          machineCode={simulatorState.PMEM}
          highlightByte={simulatorState.currentAddress}
        />
      </Box>
    </>
  );
}
