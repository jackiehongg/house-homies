import { useState } from "react";
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ReceiptOffscreen from './ReceiptOffscreen';
import Auth from './Auth'



export default function NavbarMenu({ user, setUser, cookies, handleLoadReceipt }) {

    const [showOffscreen, setShowOffscreen] = useState(false);
    const handleToggleShowOffscreen = () => setShowOffscreen(!showOffscreen);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Container>
                        <Toolbar>
                            <Typography variant="h5">HouseHomies</Typography>
                            {/* <Button variant="primary">Home</Button> */}
                            <Button variant="primary" onClick={handleToggleShowOffscreen}>Receipts</Button>

                            <Box sx={{ flexGrow: 1 }}></Box>
                            <Auth user={user} setUser={setUser} cookies={cookies}/>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>

            <ReceiptOffscreen show={showOffscreen} handleToggleShow={handleToggleShowOffscreen} user={user} handleLoadReceipt={handleLoadReceipt} />
        </>
    );
}

