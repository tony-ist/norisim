import React, { useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { EmulatorContext } from '../../App.tsx';
import Grid from '@mui/material/Grid';
import styles from './MainPage.module.css';
import { CodeEditor } from '../code-editor/CodeEditor.tsx';
import { EmulatorStateViewer } from '../state-viewer/EmulatorStateViewer.tsx';
import { PortInput } from '../port-input/PortInput.tsx';
import { EmulatorControls } from '../controls/EmulatorControls.tsx';
import Container from '@mui/material/Container';

const RUN_INTERVAL_MS = 1;

interface RunToOptions {
  cycle?: number;
  pc?: number;
}

export function MainPage() {
  const { initEmulator, emulatorState, step: emulatorStep, portInput: emulatorPortInput } = useContext(EmulatorContext);
  const [asmCode, setAsmCode] = useState('');
  const [portInputValue, setPortInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const asmCode = localStorage.getItem('asmCode');
    if (asmCode !== null) {
      setAsmCode(asmCode);
    }
  }, []);

  useEffect(() => {
    if (asmCode !== '') {
      localStorage.setItem('asmCode', asmCode);
    }
  }, [asmCode]);

  function handleError(error: Error) {
    if (isRunning) {
      stop();
    }
    console.error(error);
    setError(error.message);
  }

  function compile() {
    stop();
    setError(null);
    setPortInputValue('');
    try {
      initEmulator(asmCode);
      setIsEditing(false);
    } catch (error) {
      handleError(error as Error);
    }
  }

  function step() {
    if (emulatorState === null) {
      throw new Error('Should initialize emulator before using step on it');
    }

    setError(null);

    try {
      emulatorStep();
    } catch (error) {
      handleError(error as Error);
    }
  }

  function run() {
   runTo({ cycle: +Infinity });
  }

  function stop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  }

  function runTo(options: RunToOptions) {
    const { cycle = +Infinity, pc = +Infinity } = options;

    intervalRef.current = setInterval(() => {
      if (emulatorState === null) {
        throw new Error('Should initialize emulator before using run on it');
      }

      try {
        const isHalt = emulatorState.asmLines[emulatorState.lineIndex].isHalt();

        if (isHalt || emulatorState.cycle >= cycle || emulatorState.PC === pc) {
          stop();
          return;
        }

        if (!emulatorState.isWaitingPortInput) {
          step();
        }
      } catch (error) {
        console.error(error);
        stop();
      }
    }, RUN_INTERVAL_MS);
    setIsRunning(true);
  }

  function portInput() {
    if (emulatorState === null) {
      throw new Error('Should initialize emulator before using port input on it');
    }

    if (emulatorState.isWaitingPortInput) {
      try {
        if (portInputValue === '') {
          throw new Error('You should write port input value first');
        }
        setError(null);
        emulatorPortInput(portInputValue);
        setPortInputValue('');
      } catch (error) {
        handleError(error as Error);
      }
    } else {
      throw new Error('Using port input while not waiting for port input');
    }
  }

  return (
    <>
      <Container>
        <Grid container className={styles.panelsContainer}>
          <Grid item>
            <CodeEditor
              isEditing={isEditing}
              asmLines={emulatorState?.asmLines}
              currentLineIndex={emulatorState?.lineIndex}
              asmCode={asmCode}
              setAsmCode={setAsmCode}
            />
            <EmulatorControls
              compile={compile}
              step={step}
              run={run}
              stop={stop}
              runToCycle={(cycle) => runTo({ cycle })}
              runToPC={(pc) => runTo({ pc })}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isRunning={isRunning}
            />
          </Grid>
          <Grid item>
            {
              error &&
              <Box className={styles.errorContainer}>{error}</Box>
            }
            {
              emulatorState &&
              <Box>
                {
                  emulatorState.isWaitingPortInput &&
                  <PortInput
                    triggerPortInput={portInput}
                    portInputValue={portInputValue}
                    setPortInputValue={setPortInputValue}
                  />
                }
                <EmulatorStateViewer emulatorState={emulatorState} />
              </Box>
            }
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
