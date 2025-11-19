import { HexViewer } from '../hex/HexViewer.tsx';
import Box from '@mui/material/Box';

interface StackViewerPropTypes {
  binaryData: number[]
}

export function StackViewer(props: StackViewerPropTypes) {
  const { binaryData } = props;

  return (
    <Box sx={{ minHeight: 43 }}>
      <HexViewer
        title={'Stack'}
        binaryData={binaryData}
      />
    </Box>
  );
}

