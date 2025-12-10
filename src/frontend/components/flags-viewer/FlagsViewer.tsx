import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';

interface FlagsViewerPropTypes {
  // Zero Flag
  ZF: boolean
  // Carry Flag
  CF: boolean
  // Negative Flag
  NF: boolean
  // Overflow Flag
  VF: boolean
}

export function FlagsViewer(props: FlagsViewerPropTypes) {
  const { ZF, CF, NF, VF } = props;
  const labels = ['ZF', 'CF', 'NF', 'VF'];
  const values = [ZF, CF, NF, VF];
  const columns = labels.map((label, index) => ({
    label,
    value: values[index] ? 1 : 0,
  }));

  return (
    <SimpleHexViewer
      title="Flags"
      columns={columns}
    />
  );
}
