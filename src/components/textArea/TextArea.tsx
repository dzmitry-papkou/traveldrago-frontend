import { DialogContentText, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import React from 'react';

type Props = TextFieldProps & {
  contentType: string;
};

const TextArea: React.FC<Props> = ({ contentType, ...textFieldProps }) => {
  return (
    <>
      <DialogContentText>
        {contentType} <span style={{ color: 'red' }}>*</span>
      </DialogContentText>
      <TextField
        name={textFieldProps.name}
        {...textFieldProps}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />
    </>
  );
};

export default TextArea;
