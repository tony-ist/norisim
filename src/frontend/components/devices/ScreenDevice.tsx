import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

const SCREEN_SIZE = 32;
const PIXEL_SIZE = 8;
const OFF_COLOR = '#fff';
const ON_COLOR = '#000';

const OPCODE_WRITE_PIXEL = 0;
const OPCODE_CLEAR_PIXEL = 1;
const OPCODE_DRAW_BUFFER = 2;
const OPCODE_CLEAR_BUFFER = 3;

const SCREEN_PORT = 0;

function createEmptyPixelGrid(): boolean[][] {
  return Array.from({ length: SCREEN_SIZE }, () => Array(SCREEN_SIZE).fill(false));
}

interface ByteCollectorState {
  waitingForSecondByte: boolean
  highByte: number
  lastPortValue: number | null
}

export function ScreenDevice() {
  const [buffer, setBuffer] = useState<boolean[][]>(createEmptyPixelGrid);
  const [display, setDisplay] = useState<boolean[][]>(createEmptyPixelGrid);

  const byteCollector = useRef<ByteCollectorState>({
    waitingForSecondByte: false,
    highByte: 0,
    lastPortValue: null,
  });

  const outputPort0 = useAppSelector((state: RootState) =>
    state.simulator.noriSimulatorState?.outputPorts[SCREEN_PORT] ?? null,
  );

  useEffect(() => {
    if (outputPort0 === null) {
      return;
    }

    const collector = byteCollector.current;

    if (collector.lastPortValue === outputPort0) {
      return;
    }
    collector.lastPortValue = outputPort0;

    if (!collector.waitingForSecondByte) {
      collector.highByte = outputPort0;
      collector.waitingForSecondByte = true;
    }
    else {
      const lowByte = outputPort0;
      const command = (collector.highByte << 8) | lowByte;
      executeCommand(command);
      collector.waitingForSecondByte = false;
    }
  }, [outputPort0]);

  function executeCommand(command: number): void {
    const opcode = (command >> 10) & 0x1F;
    const y = (command >> 5) & 0x1F;
    const x = command & 0x1F;

    switch (opcode) {
      case OPCODE_WRITE_PIXEL:
        writePixelToBuffer(x, y);
        break;
      case OPCODE_CLEAR_PIXEL:
        clearPixelFromBuffer(x, y);
        break;
      case OPCODE_DRAW_BUFFER:
        drawBufferToDisplay();
        break;
      case OPCODE_CLEAR_BUFFER:
        clearBuffer();
        break;
      default:
        break;
    }
  }

  function writePixelToBuffer(x: number, y: number): void {
    if (x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
      return;
    }
    setBuffer((prev) => {
      const newBuffer = prev.map(row => [...row]);
      newBuffer[y][x] = true;
      return newBuffer;
    });
  }

  function clearPixelFromBuffer(x: number, y: number): void {
    if (x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
      return;
    }
    setBuffer((prev) => {
      const newBuffer = prev.map(row => [...row]);
      newBuffer[y][x] = false;
      return newBuffer;
    });
  }

  function drawBufferToDisplay(): void {
    setDisplay(buffer.map(row => [...row]));
  }

  function clearBuffer(): void {
    setBuffer(createEmptyPixelGrid());
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SCREEN_SIZE}, ${PIXEL_SIZE}px)`,
        gridTemplateRows: `repeat(${SCREEN_SIZE}, ${PIXEL_SIZE}px)`,
        backgroundColor: OFF_COLOR,
        border: '2px solid #777',
        width: 'fit-content',
      }}
    >
      {display.flatMap((row, y) =>
        row.map((isOn, x) => (
          <Box
            key={`${x}-${y}`}
            sx={{
              width: PIXEL_SIZE,
              height: PIXEL_SIZE,
              backgroundColor: isOn ? ON_COLOR : OFF_COLOR,
            }}
          />
        )),
      )}
    </Box>
  );
}
