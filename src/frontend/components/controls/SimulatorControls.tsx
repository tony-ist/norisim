import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RootState, store } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import styles from './SimulatorControls.module.css';
import { useEffect, useState } from 'react';

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const isInitialized = useAppSelector((state: RootState) => state.simulator.noriSimulatorState !== null);
  const isRunning = useAppSelector((state: RootState) => state.simulator.isRunning);
  const [scheduled, setScheduled] = useState(false);

  const makeStepAndScheduleNext = () => {
    if (!store.getState().simulator.isRunning) {
      setScheduled(false);
      return;
    }

    if (store.getState().simulator.isWaitingPortInput) {
      setTimeout(makeStepAndScheduleNext, 0);
      return;
    }

    const currentState = store.getState();
    const currentIR = currentState.simulator.noriSimulatorState?.ir;
    const currentSimulatorState = currentState.simulator.noriSimulatorState;
    const currentError = currentState.simulator.error;

    if (!currentIR || !currentSimulatorState) {
      setScheduled(false);
      return;
    }

    if (currentSimulatorState.currentAddress >= currentIR.length) {
      setScheduled(false);
      return;
    }

    const currentInstruction = currentIR[currentSimulatorState.currentAddress];
    if (currentInstruction && currentInstruction.mnemonic === 'HLT') {
      setScheduled(false);
      return;
    }

    if (currentError) {
      setScheduled(false);
      return;
    }

    dispatch(simulatorSlice.actions.step());
    setTimeout(makeStepAndScheduleNext, 0);
  };

  useEffect(() => {
    if (isRunning && !scheduled) {
      setScheduled(true);
      makeStepAndScheduleNext();
    }
  }, [isRunning, scheduled]);

  function init() {
    dispatch(simulatorSlice.actions.stop());
    dispatch(simulatorSlice.actions.init(sourceCode));
  }

  function step() {
    dispatch(simulatorSlice.actions.step());
  }

  function reset() {
    dispatch(simulatorSlice.actions.reset());
  }

  function stop() {
    dispatch(simulatorSlice.actions.stop());
  }

  async function run() {
    dispatch(simulatorSlice.actions.run());
  }

  return (
    <Box className={styles.buttonsContainer}>
      <Box className={styles.buttonsRow}>
        <Box>
          <Button
            variant="contained"
            onClick={init}
          >
            {
              isInitialized
                ? 'Reset'
                : 'Compile'
            }
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
            disabled={isRunning || !isInitialized}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
