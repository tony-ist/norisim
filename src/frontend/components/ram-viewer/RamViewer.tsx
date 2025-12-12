import { Box } from '@mui/material';
import { HexViewer } from '../hex/HexViewer.tsx';

interface RamViewerPropTypes {
  RAM: number[]
}

export function RamViewer(props: RamViewerPropTypes) {
  const { RAM } = props;

  return (
    <HexViewer
      title="RAM"
      binaryData={RAM}
    />
  );
}
