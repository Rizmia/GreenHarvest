import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';

const ActionButtons = ({ language, loading, handleSubmit, startVoiceRecognition }) => {
  return (
    <Box display="flex" justifyContent="space-between" style={{ marginBottom: '20px' }}>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        style={{ backgroundColor: '#2e7d32', color: 'white', textTransform: 'uppercase' }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : language === 'sinhala' ? (
          'ඉදිරිපත් කරන්න'
        ) : language === 'tamil' ? (
          'சமர்ப்பிக்கவும்'
        ) : (
          'Submit'
        )}
      </Button>
      <Button
        variant="contained"
        onClick={startVoiceRecognition}
        style={{ backgroundColor: '#2e7d32', color: 'white', textTransform: 'uppercase' }}
      >
        {language === 'sinhala' ? 'හඬ භාවිතා කරන්න' : language === 'tamil' ? 'குரலைப் பயன்படுத்தவும்' : 'Use Voice'}
      </Button>
    </Box>
  );
};

export default ActionButtons;