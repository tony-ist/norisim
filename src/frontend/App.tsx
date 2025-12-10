import { CodeEditor } from './components/code-editor/CodeEditor';
import { SimulatorControls } from './components/controls/SimulatorControls';
import { SimulatorStateViewer } from './components/state-viewer/SimulatorStateViewer';
import styles from './App.module.css';
import { Box } from '@mui/material';

export function App() {
  return (
    <Box className={styles.layout}>
      <Box className={styles.header}>
        <img src="/redstone.webp" alt="Redstone" className={styles.logo} />
        <h1 className={styles.title}>Nori Simulator</h1>
      </Box>
      <Box className={styles.content}>
        <Box>
          <CodeEditor />
          <SimulatorControls />
        </Box>
        <SimulatorStateViewer />
      </Box>
    </Box>
  );
}
