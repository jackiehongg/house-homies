import { React, useState } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ImageIcon from '@mui/icons-material/Image';
import Stack from '@mui/material/Stack';

export default function MemberForm({ members, handleSubmitMember, handleDeleteMember }) {
  const [name, setName] = useState("");

  return (
    <>
      <Box>
        <Box component="form" onSubmit={(e) => { handleSubmitMember(e); setName(''); }} sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} autoComplete='off'>
          <Typography variant="h5" gutterBottom>Add Members</Typography>
          <TextField
            required
            id="outlined-member"
            name="member"
            label="Name"
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)} />
          <Button variant="outlined" type="submit">Submit</Button>
        </Box>
      </Box>

      <Box>
        <List sx={{ padding: 0 }} component={Stack} direction="row">
          {members.map((member) => (
            <Button sx={{textTransform: 'capitalize'}}>
              <ListItem onClick={(e) => handleDeleteMember(e, member)} key={member}>
                <ListItemAvatar>
                  <PersonRoundedIcon>
                    <ImageIcon />
                  </PersonRoundedIcon>
                </ListItemAvatar>
                <ListItemText primary={member} />
              </ListItem>
            </Button>
          ))}
        </List>
      </Box>

    </>
  );
}
