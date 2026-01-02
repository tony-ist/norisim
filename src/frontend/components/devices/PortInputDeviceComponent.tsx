import { Box, TextField, Button } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { useState } from 'react';
import { simulatorSlice } from '../../store/slices/simulatorSlice';

export function PortInputDeviceComponent() {
  const [inputValue, setInputValue] = useState('');
  const [parsedInputValue, setParsedInputValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  function parsePortInputValue(value: string) {
    const lowerValue = value.toLowerCase();
    if (lowerValue.startsWith('0x')) {
      return parseInt(lowerValue.slice(2), 16);
    }
    else if (lowerValue.startsWith('0b')) {
      return parseInt(lowerValue.slice(2), 2);
    }
    else if (lowerValue.startsWith('0')) {
      return parseInt(lowerValue, 8);
    }
    else {
      return parseInt(lowerValue, 10);
    }
  }

  function handleOkClick() {
    dispatch(simulatorSlice.actions.portInput(parsedInputValue));
    setError(null);
    setInputValue('');
    setParsedInputValue(null);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    const parsedValue = parsePortInputValue(event.target.value);
    setParsedInputValue(parsePortInputValue(event.target.value));
    if (isNaN(parsedValue)) {
      setError('Invalid input value');
    }
    else {
      setError(null);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, pb: 2 }}>
      <TextField
        label="Port Input"
        value={inputValue}
        onChange={handleInputChange}
        error={!!error}
        helperText={error}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={handleOkClick}
        disabled={error !== null}
      >
        Ok
      </Button>
    </Box>
  );
}
