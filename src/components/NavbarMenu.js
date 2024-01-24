import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ReceiptOffscreen from './ReceiptOffscreen';




export default function NavbarMenu({ user, handleLoadReceipt, login }) {

    const [showOffscreen, setShowOffscreen] = useState(false);
    const handleToggleShowOffscreen = () => setShowOffscreen(!showOffscreen);



    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5">HouseHomies</Typography>
                        {/* <Button variant="primary">Home</Button> */}
                        <Button variant="primary" onClick={handleToggleShowOffscreen}>Receipts</Button>

                        <Box sx={{ flexGrow: 1 }}></Box>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log('Login Success')
                                login(credentialResponse.credential);
                            }}
                            onError={() => {
                                console.log('Login Failed')
                            }}
                        />                  
                        </Toolbar>
                </AppBar>
            </Box>

            <ReceiptOffscreen show={showOffscreen} handleToggleShow={handleToggleShowOffscreen} user={user} handleLoadReceipt={handleLoadReceipt} />
        </>
    );
}

