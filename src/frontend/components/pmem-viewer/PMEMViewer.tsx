import { HexViewer } from '../hex/HexViewer.tsx';

interface PMemViewerPropTypes {
  machineCode: number[]
  highlightByte?: number
  highlightSize?: number
}

export function PMemViewer(props: PMemViewerPropTypes) {
  const { machineCode, highlightByte } = props;

  return (
    <HexViewer
      title="Program Memory"
      binaryData={machineCode}
      highlightByte={highlightByte}
    />
  );
}
