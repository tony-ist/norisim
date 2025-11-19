import { SimpleHexViewer } from '../simple-hex-viewer/SimpleHexViewer.tsx';

interface FlagsViewerPropTypes {
  ZF: boolean;
  COUTF: boolean;
  MSBF: boolean;
  LSBF: boolean;
}

export function FlagsViewer(props: FlagsViewerPropTypes) {
  const { ZF, COUTF, MSBF, LSBF } = props;
  const labels = ['ZF', 'CF', 'MF', 'LF'];
  const values = [ZF, COUTF, MSBF, LSBF];
  const columns = labels.map((label, index) => ({
    label,
    value: values[index] ? 1 : 0,
  }));

  return (
    <SimpleHexViewer
      title={'Flags'}
      columns={columns}
    />
  );
}

