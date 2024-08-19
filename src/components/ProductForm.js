import { React, useState, useRef } from "react";
import styled from "styled-components";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';



export default function ProductForm({ handleSubmitProduct, members }) {

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
      <Box component="form" onSubmit={(e) => { handleSubmit(e); inputRef.current.focus(); }} sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} autoComplete='off'>
        <Typography variant="h5" gutterBottom>Add Expenses</Typography>
        <TextField
          select
          id="outlined-select-purchaser"
          name="purchaser"
          label="Purchaser"
          size="small"
          placeholder="None"
          defaultValue=""
          disabled={members.length < 1}
          required
        >
          {members.map((member) => (
            <MenuItem key={member} value={member}>
              {member}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="outlined-label"
          name="label"
          label="Expense"
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
          onChange={(e) => {
            // Ensure input is numeric
            if (/^\d*\.?\d*$/.test(e.target.value)) {
              setValue(e.target.value);
            }
          }}
        />
        <Button variant="outlined" type="submit">Submit</Button>
      </Box>

    </>
  );
}
