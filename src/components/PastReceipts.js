import { useEffect, useState } from 'react';
import axios from 'axios';
import PastReceiptCard from './PastReceiptCard';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

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
            axios.get('/users/' + user.email + '/receipts')
                .then(function (response) {
                    setReceiptList(response.data)
                }).catch(function (error) {
                    console.log(error)
                });
        }
    }, [user, showPastReceipts])

    return (
        <>
            <Dialog open={showPastReceipts} onClose={() => handleShowPastReceipts(false)} fullWidth={true} maxWidth={'xs'}>
                <DialogTitle id="alert-dialog-title">
                    <Typography><b>Past Receipts</b></Typography>
                </DialogTitle>
                <DialogContent>
                    {user ? (<Box display="flex" justifyContent="center" alignItems="center">
                        {(receiptList.length > 0) ? (
                            <Stack spacing={2}>
                            {(receiptList).map((receipt, idx) => (
                                <PastReceiptCard key={idx} receipt={receipt} handleUserReceipts={handleUserReceipts} handleShowPastReceipts={handleShowPastReceipts}/>
                            ))}
                            </Stack>

                        ) : (
                        <DialogContentText>No receipts found! Try making your first receipt and finding it here.</DialogContentText>
                        )}
                    </Box>) : (
                        <DialogContentText>Logging in with your Google account is required to save receipts and load ones from the past.</DialogContentText>
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