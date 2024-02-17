import { React } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Title({title, handleTitleChange}) {

  return (
    <>
        <Box component="form" sx={{ '& > :not(style)': { m: 1, mt: 2, width: '98%' } }} autoComplete='off' onSubmit={handleTitleChange}>
          <TextField
            required
            id="outlined-member"
            name="title"
            label="Title"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={title}
            onChange={handleTitleChange}
            />
        </Box>
    </>
  );
}
