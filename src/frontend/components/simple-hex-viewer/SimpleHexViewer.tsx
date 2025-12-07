import Box from '@mui/material/Box';
import { toHexBytes } from '../../../util/asm-util.ts';

export interface SimpleHexViewColumn {
  label: string;
  value: number;
}

interface HexViewerPropTypes {
  title: string;
  columns: SimpleHexViewColumn[];
}

export function SimpleHexViewer(props: HexViewerPropTypes) {
  const { title, columns } = props;
  const hexData = toHexBytes(columns.map((column) => column.value));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>{title}</Box>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        {
          hexData.map((value, index) => (
            <Box key={index}>
              <Box>{ columns[index].label }</Box>
              <Box>{ value }</Box>
            </Box>
          ))
        }
      </Box>
    </Box>
  );
}

