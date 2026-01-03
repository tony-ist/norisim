import Box from '@mui/material/Box';
import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';
import { GPR_COUNT } from '../../../const/simulator-constants';

interface RegViewerPropTypes {
  registers: number[]
}

export function RegViewer(props: RegViewerPropTypes) {
  const { registers } = props;
  const columnLabels = Array.from({ length: GPR_COUNT }, (_, i) => `R${i}`);
  const columns = columnLabels.map((label, index) => ({
    label,
    value: registers[index] ?? 0,
  }));

  return (
    <Box>
      <SimpleHexViewer
        title="Registers"
        columns={columns}
      />
    </Box>
  );
}
