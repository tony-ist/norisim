import Box from '@mui/material/Box';
import { fromHex, toHex } from '../../asm/asm-util.ts';
import styles from './HexViewer.module.css';
import { groupElements } from '../../../util/common-util.ts';
import { generateLabels, VALUES_IN_A_ROW } from '../../../util/hex-viewer-util.ts';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { WORD_SIZE } from '../../../const/simulator-constants.ts';

interface HexViewerPropTypes {
  title: string;
  binaryData: number[];
  displayEditButton?: boolean;
  setData?: (binaryData: number[]) => void;
  highlightByte?: number;
  highlightSize?: number;
  displayCopyButton?: boolean;
}

export function HexViewer(props: HexViewerPropTypes) {
  const {
    title,
    binaryData,
    highlightByte,
    highlightSize = 1,
    displayEditButton = false,
    displayCopyButton = false,
    setData = () => {
      throw new Error('setData should not be called when it is not passed as a prop');
    },
  } = props;
  const hexData = toHex(binaryData);
  const groupedHexData = groupElements(hexData, VALUES_IN_A_ROW);
  const labels = generateLabels(hexData.length);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  if (binaryData.length === 0) {
    return (
      <Box>
        <Box>{title}</Box>
        <Box>Empty</Box>
      </Box>
    );
  }

  function highlightClassName(groupIndex: number, elementIndex: number) {
    if (highlightByte === undefined) {
      return '';
    }

    const index = groupIndex * VALUES_IN_A_ROW + elementIndex;

    if (index === highlightByte || index === highlightByte + highlightSize - 1) {
      return styles.highlight;
    }

    return '';
  }

  function setEditedData() {
    try {
      const oneLine = editModalData.replace(/[ \n]+/g, ' ');
      const binaryData = fromHex(oneLine.split(' '));
      const invalidData = binaryData.findIndex((value) => value >= WORD_SIZE);
      if (invalidData !== -1) {
        const hexIndex = toHex([invalidData])[0];
        throw new Error(`Invalid byte with index "${hexIndex}". Value is greater or equal to word size ${WORD_SIZE}`);
      }
      setData(binaryData);
      setIsEditModalOpen(false);
    } catch (error) {
      setModalError((error as Error).message);
    }
  }

  function openEditModal() {
    const hexLines = groupedHexData.map((group) => group.join(' ')).join('\n');
    setModalError(null);
    setEditModalData(hexLines);
    setIsEditModalOpen(true);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(hexData.join(' '));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{title}</Box>
        {
          displayCopyButton &&
            <Box>
                <IconButton onClick={copyToClipboard}>
                    <ContentCopyIcon fontSize="small"/>
                </IconButton>
            </Box>
        }
        {
          displayEditButton &&
            <Box>
                <IconButton onClick={openEditModal}>
                    <EditIcon fontSize="small"/>
                </IconButton>
            </Box>
        }
      </Box>
      <Box>
        {
          groupedHexData.map((group, groupIndex) =>
            <Box key={groupIndex} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box>{labels[groupIndex]}</Box>
              <Box sx={{ marginRight: 1 }}>|</Box>
              <Box>
                {
                  group.map((hex, elementIndex) =>
                    <Box
                      key={`${groupIndex}-${elementIndex}`}
                      className={highlightClassName(groupIndex, elementIndex)}
                      sx={{ display: 'inline-block' }}
                      marginRight={1}
                    >
                      {hex}
                    </Box>
                  )
                }
              </Box>
            </Box>
          )
        }
      </Box>
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <Box
          className={styles.editModal}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5px', marginTop: '-1px' }}>
              {
                labels.map((label, index) => <Box key={index}>{label}</Box>)
              }
            </Box>
            <TextField
              label="Input Data"
              value={editModalData}
              rows={16}
              multiline
              fullWidth
              inputProps={{ style: { fontFamily: 'RobotoMono, sans-serif' } }}
              onChange={(textArea) => setEditModalData(textArea.target.value)}
            />
          </Box>
          {
            modalError &&
              <Box
                  className={styles.errorContainer}
                  sx={{ marginTop: 1, textAlign: 'center' }}
              >
                {modalError}
              </Box>
          }
          <Button
            onClick={setEditedData}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

