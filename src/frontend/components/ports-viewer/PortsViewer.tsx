import Box from '@mui/material/Box';
import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';
import styles from './PortsViewer.module.css';

interface PortsViewerPropTypes {
  inputPorts: number[]
  outputPorts: number[]
}

export function PortsViewer(props: PortsViewerPropTypes) {
  const { inputPorts, outputPorts } = props;

  const inputColumns = inputPorts.map((value, index) => ({
    label: `IN${index}`,
    value: value ?? 0,
  }));

  const outputColumns = outputPorts.map((value, index) => ({
    label: `OUT${index}`,
    value: value ?? 0,
  }));

  return (
    <Box className={styles.container}>
      <SimpleHexViewer
        title="Input Ports"
        columns={inputColumns}
      />
      <SimpleHexViewer
        title="Output Ports"
        columns={outputColumns}
      />
    </Box>
  );
}
