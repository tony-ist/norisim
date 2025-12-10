import styles from './SimulatorControls.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import { RootState } from '../../store';

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);
  const isInitialized = useAppSelector((state: RootState) => state.simulator.ir !== null);

  function compile() {
    dispatch(simulatorSlice.actions.init(sourceCode));
  }

  function step() {
    dispatch(simulatorSlice.actions.step());
  }

  function reset() {
    dispatch(simulatorSlice.actions.reset());
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
          variant="outlined"
          onClick={step}
          disabled={!isInitialized}
        >
          Step
        </Button>
        </Box>
        <Box>
        <Button
          variant="outlined"
          color="error"
          onClick={reset}
        >
          Reset
        </Button>
        </Box>
      </Box>
    </Box>
  );
}