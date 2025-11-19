import { HexViewer } from '../hex/HexViewer.tsx';
import { useContext } from 'react';
import { EmulatorContext } from '../../App.tsx';

interface RamViewerPropTypes {
  binaryData: number[]
}

export function RamViewer(props: RamViewerPropTypes) {
  const { binaryData } = props;
  const { setRAM } = useContext(EmulatorContext);

  return (
    <HexViewer
      title={'RAM'}
      binaryData={binaryData}
      setData={setRAM}
      displayEditButton
      displayCopyButton
    />
  );
}

