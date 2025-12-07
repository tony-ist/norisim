import Box from '@mui/material/Box';
import { toHexBytes } from '../../../util/asm-util.ts';
import { RegViewer } from '../reg-viewer/RegViewer.tsx';
import { StackViewer } from '../stack-viewer/StackViewer.tsx';
import { FlagsViewer } from '../flags-viewer/FlagsViewer.tsx';
import { useAppSelector } from '../../store/hooks.ts';
import { RootState } from '../../store/index.ts';

export function SimulatorStateViewer() {
    const simulatorState = useAppSelector((state: RootState) => state.simulator.noriSimulatorState);

    if (!simulatorState) {
        return <Box>No simulator initialized</Box>;
    }

    return (
    <Box>
        <Box>Cycle (decimal): {simulatorState.cycle}</Box>
        <Box>PC (hex): {toHexBytes([simulatorState.PC])}</Box>
        <Box>PC (binary): {simulatorState.PC.toString(2).padStart(8, '0')}</Box>
        
        <RegViewer
            registers={simulatorState.registers}
        />
        <StackViewer
            binaryData={simulatorState.stack}
        />
        <FlagsViewer
            ZF={simulatorState.ZF}
            CF={simulatorState.CF}
            NF={simulatorState.NF}
            VF={simulatorState.VF}
        />
    </Box>
    );
}