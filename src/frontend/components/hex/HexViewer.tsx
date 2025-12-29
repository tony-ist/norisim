import { Box } from '@mui/material';
import { toHexBytes } from '../../../util/asm-util';
import { groupElements } from '../../../util/common-util';
import styles from './HexViewer.module.css';

interface HexViewerPropTypes {
  title: string
  binaryData: number[]
  highlightByte?: number
}

const MAX_ROWS = 16;

export function HexViewer(props: HexViewerPropTypes) {
  const { title, binaryData, highlightByte } = props;

  const hexData = toHexBytes(binaryData);
  const groupedHexData = groupElements(hexData, 16);
  const rowLabels = ['0x00', '0x10', '0x20', '0x30', '0x40', '0x50', '0x60', '0x70', '0x80', '0x90', '0xA0', '0xB0', '0xC0', '0xD0', '0xE0', '0xF0'];
  const columnLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F'];

  return (
    <Box>
      <strong>{ title }</strong>
      <Box>
        <Box className={styles.label} marginLeft={7}>{ columnLabels[0] }</Box>
        {
          columnLabels.slice(1).map((label, index) =>
            <Box className={styles.label} marginLeft={1} key={index}>{label}</Box>,
          )
        }
        {
          groupedHexData.slice(0, MAX_ROWS).map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box className={styles.label}>{rowLabels[groupIndex]}</Box>
              <Box sx={{ marginRight: 1 }}>|</Box>
              <Box>
                {
                  group.map((hex, elementIndex) => (
                    <Box
                      key={`${groupIndex}-${elementIndex}`}
                      sx={{ display: 'inline-block' }}
                      marginRight={1}
                      className={highlightByte === groupIndex * 16 + elementIndex ? styles.highlight : ''}
                    >
                      {hex}
                    </Box>
                  ),
                  )
                }
              </Box>
            </Box>
          ),
          )
        }
      </Box>
    </Box>
  );
}
