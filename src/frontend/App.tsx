import { CodeEditor } from './components/code-editor/CodeEditor';
import { SimulatorControls } from './components/controls/SimulatorControls';
import { SimulatorStateViewer } from './components/state-viewer/SimulatorStateViewer';

export function App() {

  const initialCode = `
    // Calculates fibonacci, does r1 iterations

    lim r1, 5 // iterations
    lim r2, 1
    lim r3, 1

    .loop
        add r2, r2, r3
        mov r4, r2
        mov r2, r3
        mov r3, r4

        addi r1, -1
        jnz .loop

    pst  r2, 1
    hlt
  `;
  return (
    <>
      <CodeEditor />
      <SimulatorControls />
      <SimulatorStateViewer />
    </>
  );
}
