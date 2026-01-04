import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SCREEN_SIZE = 32;
const PIXEL_SIZE = 8;
const OFF_COLOR = '#fff';
const ON_COLOR = '#000';

export function ScreenDevice() {
  const [pixels, setPixels] = useState<boolean[][]>(() =>
    Array.from({ length: SCREEN_SIZE }, () => Array(SCREEN_SIZE).fill(false)),
  );

  useEffect(() => {
    setPixel(0, 0);
    setPixel(0, 1);
    setPixel(31, 31);
  }, []);

  function setPixel(x: number, y: number): void {
    if (x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
      return;
    }
    setPixels((prev) => {
      const newPixels = prev.map(row => [...row]);
      newPixels[y][x] = true;
      return newPixels;
    });
  }

  function clearPixel(x: number, y: number): void {
    if (x < 0 || x >= SCREEN_SIZE || y < 0 || y >= SCREEN_SIZE) {
      return;
    }
    setPixels((prev) => {
      const newPixels = prev.map(row => [...row]);
      newPixels[y][x] = false;
      return newPixels;
    });
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Screen (32×32)
      </Typography>
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
        {pixels.flatMap((row, y) =>
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
    </Box>
  );
}
