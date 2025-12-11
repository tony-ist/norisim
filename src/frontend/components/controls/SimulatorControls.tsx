import styles from './SimulatorControls.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import { RootState, store } from '../../store';
import { useState } from 'react';

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const isInitialized = useAppSelector((state: RootState) => state.simulator.ir !== null);
  const ir = useAppSelector((state: RootState) => state.simulator.ir);
  const simulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);
  const [isRunning, setIsRunning] = useState(false);

  function compile() {
    dispatch(simulatorSlice.actions.init(sourceCode));
  }

  function step() {
    dispatch(simulatorSlice.actions.step());
  }

  function reset() {
    dispatch(simulatorSlice.actions.reset());
    setIsRunning(false);
  }

  async function run() {
    if (!ir || !simulatorState || isRunning) {
      return;
    }

    setIsRunning(true);

    while (true) {
      const currentState = store.getState();
      const currentIR = currentState.simulator.ir;
      const currentSimulatorState = currentState.simulator.noriSimulatorState;
      const currentError = currentState.simulator.error;

      if (!currentIR || !currentSimulatorState) {
        break;
      }

      if (currentSimulatorState.currentAddress >= currentIR.length) {
        break;
      }

      const currentInstruction = currentIR[currentSimulatorState.currentAddress];
      if (currentInstruction && currentInstruction.mnemonic === 'HLT') {
        break;
      }

      if (currentError) {
        break;
      }

      dispatch(simulatorSlice.actions.step());

      await new Promise(resolve => setTimeout(resolve, 0));
    }

    setIsRunning(false);
  }

  return (
    <Box className={styles.buttonsContainer}>
      <Box className={styles.buttonsRow}>
        <Box>
          <Button
            variant="contained"
            onClick={compile}
          >
            Compile
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="warning"
            onClick={step}
            disabled={!isInitialized || isRunning}
          >
            Step
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="success"
            onClick={run}
            disabled={!isInitialized || isRunning}
          >
            Run
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={reset}
            disabled={isRunning}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
