import React from 'react'
import dayjs from 'dayjs';


import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Stack from '@mui/material/Stack';

export default function PastReceiptCard({receipt, handleUserReceipts, handleShowPastReceipts}) {
    return (
        <List key={receipt['_id']['$oid']} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={6}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ReceiptIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={receipt['title']} secondary={"Updated " + dayjs(receipt['date']['$date']).format('MMM D, YYYY')} />
                </ListItem>
                <Button sx={{ maxHeight: '50%' }} variant='contained' size='medium' onClick={(e) => { handleUserReceipts(e, receipt['_id']['$oid']); handleShowPastReceipts(false) }}>View</Button>
            </Stack>
        </List>
    )
}
