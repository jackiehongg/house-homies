import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

export default function PastReceipts({ showPastReceipts, handleShowPastReceipts, user, handleLoadReceipt }) {
    const [receiptList, setReceiptList] = useState([])

    const handleUserReceipts = (e, id) => {
        e.preventDefault()
        axios.get('/receipts/' + id)
            .then(function (response) {
                const data = response.data
                handleLoadReceipt(data)
            }).catch(function (error) {
                console.log(error)
            });
    }

    useEffect(() => {
        if (user && showPastReceipts) {
            axios.get('/users/' + user.sub + '/receipts')
                .then(function (response) {
                    setReceiptList(response.data)
                }).catch(function (error) {
                    console.log(error)
                });
        }
    }, [user, showPastReceipts])

    return (
        <>
            <Dialog open={showPastReceipts} onClose={() => handleShowPastReceipts(false)}>
                <DialogTitle id="alert-dialog-title">
                    <Typography><b>Past Receipts</b></Typography>
                </DialogTitle>
                <DialogContent>
                    {user ? (<Box>
                        {(receiptList) ? (
                            (receiptList).map((receipt) => (
                                <List key={receipt['_id']['$oid']} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <Stack direction="row" spacing={6}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ReceiptIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={receipt['title']} secondary={dayjs(receipt['date']['$date']).format('MMM D, YYYY')} />
                                        </ListItem>
                                        <Button sx={{ maxHeight: '50%' }} variant='contained' size='medium' onClick={(e) => { handleUserReceipts(e, receipt['_id']['$oid']); handleShowPastReceipts(false) }}>View</Button>
                                    </Stack>
                                </List>
                            ))
                        ) :
                            ('No receipts found')
                        }
                    </Box>) : (
                        <Typography>Logging in with your Google account is required to save receipts and load ones from the past.</Typography>
                    )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleShowPastReceipts(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}