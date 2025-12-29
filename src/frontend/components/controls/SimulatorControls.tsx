import styles from './SimulatorControls.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import { RootState, store } from '../../store';
import { useState, useRef } from 'react';

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const isInitialized = useAppSelector((state: RootState) => state.simulator.noriSimulatorState !== null);
  const ir = useAppSelector((state: RootState) => state.simulator.noriSimulatorState?.ir);
  const simulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);
  const [isRunning, setIsRunning] = useState(false);
  const shouldContinueRef = useRef(true);

  function compile() {
    dispatch(simulatorSlice.actions.init(sourceCode));
  }

  function step() {
    dispatch(simulatorSlice.actions.step());
  }

  function reset() {
    dispatch(simulatorSlice.actions.reset());
    setIsRunning(false);
    shouldContinueRef.current = true;
  }

  function stop() {
    shouldContinueRef.current = false;
  }

  async function run() {
    if (!simulatorState || isRunning) {
      return;
    }

    setIsRunning(true);
    shouldContinueRef.current = true;

    while (true) {
      if (!shouldContinueRef.current) {
        break;
      }

      const currentState = store.getState();
      const currentIR = currentState.simulator.noriSimulatorState?.ir;
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
    shouldContinueRef.current = true;
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
          {isRunning
            ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={stop}
                >
                  Stop
                </Button>
              )
            : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={run}
                  disabled={!isInitialized}
                >
                  Run
                </Button>
              )}
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
