import { React, useState, useRef } from "react";

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export default function ProductForm({ handleSubmitProduct }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitProduct(e);
    setLabel("");
    setValue("");
  }

  return (
    <>
      <Box component="form" onSubmit={(e) => {handleSubmit(e); inputRef.current.focus();}} sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} autoComplete='off'>
        <Typography variant="h5" gutterBottom>Add Product</Typography>
        <TextField
          required
          id="outlined-label"
          name="label"
          label="Product"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          inputRef={inputRef}
        />
        <TextField
          required
          id="outlined-value"
          name="value"
          label="Value"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="outlined" type="submit">Submit</Button>
      </Box>

    </>
  );
}
