import Box from '@mui/material/Box';
import { groupElements, transpose } from '../../../util/common-util.ts';
import { SCREEN_SIZE } from '../../../const/simulator-constants.ts';
import styles from './ScreenViewer.module.css';

interface ScreenViewerPropsType {
  pixels: boolean[];
}

export const ScreenViewer = (props: ScreenViewerPropsType) => {
  const { pixels } = props;
  const rows = transpose(groupElements(pixels, SCREEN_SIZE));
  return (
    <Box className={styles.container}>
      <Box className={styles.heading}>Screen</Box>
      <Box className={styles.screenContainer}>
        {
          rows.map((row) => (
            <Box>
              {
                row.map((element) => (
                  <Box className={`${styles.pixel} ${element ? styles.black : ''}`} />
                ))
              }
            </Box>
          ))
        }
      </Box>
    </Box>
  );
}
