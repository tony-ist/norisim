import styles from './EmulatorControls.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface EmulatorControlsPropsType {
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

export function EmulatorControls(props: EmulatorControlsPropsType) {
  const { compile, step, run, stop, runToCycle, runToPC, isRunning, isEditing, setIsEditing } = props;
  const [cycleInputValue, setCycleInputValue] = useState('');
  const [pcInputValue, setPCInputValue] = useState('');

  function onCycleInputKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.code === 'Enter') {
      runToCycle(parseInt(cycleInputValue));
    }
  }

  function onPCInputKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.code === 'Enter') {
      runToPC(parseInt(pcInputValue, 16));
    }
  }

  return (
    <Box className={styles.buttonsContainer}>
      <Box className={styles.buttonsRow}>
        <Box>
          <Button
            variant="contained"
            onClick={compile}
          >
            {isEditing ? 'Compile' : 'Reset'}
          </Button>
        </Box>
        <Box>
          <Button
            variant='text'
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            Edit
          </Button>
        </Box>
        <Box>
          <Button
            variant="text"
            onClick={step}
            disabled={isEditing}
          >
            Step
          </Button>
        </Box>
        <Box>
          <Button
            variant="text"
            onClick={run}
            disabled={isEditing || isRunning}
          >
            Run
          </Button>
        </Box>
        <Box>
          <Button
            variant="text"
            onClick={stop}
            disabled={isEditing || !isRunning}
          >
            Stop
          </Button>
        </Box>
      </Box>
      <Box className={styles.buttonsRow}>
        <TextField
          label="Run to cycle (decimal)"
          value={cycleInputValue}
          onKeyDown={onCycleInputKeyDown}
          onChange={(event) => setCycleInputValue(event.target.value)}
          disabled={isEditing || isRunning}
        />
        <Button
          variant="text"
          onClick={() => runToCycle(parseInt(cycleInputValue))}
          disabled={isEditing || isRunning}
        >
          Run to cycle
        </Button>
      </Box>
      <Box className={styles.buttonsRow}>
        <TextField
          label="Run to PC (hex)"
          value={pcInputValue}
          onKeyDown={onPCInputKeyDown}
          onChange={(event) => setPCInputValue(event.target.value)}
          disabled={isEditing || isRunning}
        />
        <Button
          variant="text"
          onClick={() => runToPC(parseInt(pcInputValue, 16))}
          disabled={isEditing || isRunning}
        >
          Run to PC
        </Button>
      </Box>
    </Box>
  );
}