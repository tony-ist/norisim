import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React from 'react';

interface PortInputPropsType {
  triggerPortInput: () => void;
  portInputValue: string;
  setPortInputValue: (input: string) => void;
}

export function PortInput(props: PortInputPropsType) {
  const { triggerPortInput, portInputValue, setPortInputValue } = props;

  function onPortInputKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.code === 'Enter') {
      triggerPortInput();
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        autoFocus
        label="Port Input (dec, hex or bin)"
        value={portInputValue}
        onKeyDown={onPortInputKeyDown}
        onChange={(event) => setPortInputValue(event.target.value)}
      />
      <Button
        sx={{ marginLeft: '20px' }}
        variant='contained'
        onClick={triggerPortInput}
      >
        Ok
      </Button>
    </Box>
  );
}