import { Box } from '@mui/material';
import styles from './SimulatorError.module.css';

interface SimulatorErrorProps {
  error: string
}

export function SimulatorError(props: SimulatorErrorProps) {
  const { error } = props;

  return (
    <Box className={styles.error}>
      Error:
      {' '}
      {error}
    </Box>
  );
}
