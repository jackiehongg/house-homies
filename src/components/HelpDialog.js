import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function HelpDialog({ showHelp, handleShowHelp }) {

    return (
        <>
            <Dialog
                open={showHelp}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleShowHelp}
                aria-describedby="alert-dialog-slide-description"
                maxWidth="md"
            >
                <DialogTitle><Typography variant="h6" gutterBottom>
                    How to Split Your Expenses
                </Typography></DialogTitle>
                <DialogContent>

                    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
                        <Typography paragraph>
                            Here’s a quick guide to help you split your expenses:
                        </Typography>
                        <Box component="ul" sx={{ marginLeft: 2 }}>
                        <Typography component="li" paragraph>
                                <strong>Give it a Name:</strong> Help remember what this is for.
                            </Typography>
                            <Typography component="li" paragraph>
                                <strong>Add Members:</strong> List all group members involved in the split.
                            </Typography>
                            <Typography component="li" paragraph>
                                <strong>Enter Expenses:</strong> Specify who bought what, the amount, and how it should be split.
                            </Typography>
                            <Typography component="li" paragraph>
                                <strong>Adjust Contributions:</strong> Use "Check" for even splits and "Check Plus" for a larger share if someone used more.
                            </Typography>
                            <Typography component="li" paragraph>
                                <strong>Review Amounts:</strong> After entering details, see how much everyone owes each other.
                            </Typography>
                        </Box>
                        <Typography paragraph>
                            <strong>Made a mistake?</strong> Click on a member or an expenses's badge to remove it.
                        </Typography>
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleShowHelp}>OK</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
