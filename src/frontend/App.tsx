import { defaultNoriSimulatorState } from '../backend/simulator/NoriSimulator';
import { CodeEditor } from './components/code-editor/CodeEditor';
import { SimulatorControls } from './components/controls/SimulatorControls';
import { SimulatorStateViewer } from './components/state-viewer/SimulatorStateViewer';

export function App() {
  return (
    <>
      <CodeEditor />
      <SimulatorControls />
      <SimulatorStateViewer />
    </>
  );
}
