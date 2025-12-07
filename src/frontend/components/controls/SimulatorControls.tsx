import styles from './SimulatorControls.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { simulatorSlice } from '../../store/slices/simulatorSlice';
import { RootState } from '../../store';

interface SimulatorControlsPropsType {
  compile: () => void;
  step: () => void;
  run: () => void;
  stop: () => void;
  runToCycle: (cycle: number) => void;
  runToPC: (pc: number) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isRunning: boolean;
}

export function SimulatorControls() {
  const dispatch = useAppDispatch();
  const sourceCode = useAppSelector((state: RootState) => state.code.sourceCode);

  function compile() {
    dispatch(simulatorSlice.actions.init(sourceCode));
  }

  function step() {
    dispatch(simulatorSlice.actions.step());
  }
  
  return (
    <Box className={styles.buttonsContainer}>
      <Box className={styles.buttonsRow}>
          <Button
            variant="contained"
            onClick={compile}
          >
            Compile
          </Button>
      </Box>
      <Box>
        <Button
          variant="text"
          onClick={step}
        >
          Step
        </Button>
      </Box>
    </Box>
  );
}