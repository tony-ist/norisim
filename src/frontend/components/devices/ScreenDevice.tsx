import Box from '@mui/material/Box';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

const SCREEN_SIZE = 32;
const PIXEL_SIZE = 8;
const OFF_COLOR = '#fff';
const ON_COLOR = '#000';

export function ScreenDevice() {
  const display = useAppSelector((state: RootState) => state.screen.display);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SCREEN_SIZE}, ${PIXEL_SIZE}px)`,
        gridTemplateRows: `repeat(${SCREEN_SIZE}, ${PIXEL_SIZE}px)`,
        backgroundColor: OFF_COLOR,
        border: '2px solid #777',
        width: 'fit-content',
        marginBottom: '1em',
      }}
    >
      {display.flatMap((row: boolean[], y: number) =>
        row.map((isOn: boolean, x: number) => (
          <Box
            key={`${x}-${y}`}
            sx={{
              width: PIXEL_SIZE,
              height: PIXEL_SIZE,
              backgroundColor: isOn ? ON_COLOR : OFF_COLOR,
              borderTop: '1px solid #d3d3d3',
              borderLeft: '1px solid #d3d3d3',
              boxSizing: 'border-box',
            }}
          />
        )),
      )}
    </Box>
  );
}
