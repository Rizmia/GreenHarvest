import React from 'react';
import { Typography } from '@mui/material';

const ReplySection = ({ language, reply }) => {
  return (
    <Typography variant="h6" style={{ marginTop: '20px', color: '#424242' }}>
      {language === 'sinhala' ? 'පිළිතුර:' : language === 'tamil' ? 'பதில்:' : 'Reply:'} {reply}
    </Typography>
  );
};

export default ReplySection;