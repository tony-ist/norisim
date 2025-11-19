import Box from '@mui/material/Box';
import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';

interface RegViewerPropTypes {
  registers: number[]
}

export function RegViewer(props: RegViewerPropTypes) {
  const { registers } = props;
  const columnLabels = ['R1', 'R2', 'R3', 'R4'];
  const columns = columnLabels.map((label, index) => ({
    label,
    value: registers[index] ? registers[index] : 0,
  }));

  return (
    <Box>
      <SimpleHexViewer
        title={'Registers'}
        columns={columns}
      />
    </Box>
  );
}

