import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RootState, store } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import styles from './SimulatorControls.module.css';

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const isInitialized = useAppSelector((state: RootState) => state.simulator.noriSimulatorState !== null);
  const simulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);
  const isRunning = useAppSelector((state: RootState) => state.simulator.isRunning);

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
    if (!simulatorState || isRunning) {
      return;
    }

    dispatch(simulatorSlice.actions.run());

    while (store.getState().simulator.isRunning) {
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

      if (currentInstruction && currentInstruction.mnemonic === 'PLD') {
        break;
      }

      if (currentError) {
        break;
      }

      dispatch(simulatorSlice.actions.step());

      await new Promise(resolve => setTimeout(resolve, 0));
    }

    dispatch(simulatorSlice.actions.stop());
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
