import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Auth from './Auth'



export default function NavbarMenu({ user, setUser, cookies, handleShowPastReceipts, changePage }) {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Container>
                        <Toolbar>
                            <Typography variant="h5">HouseHomies</Typography>
                            <Button variant="primary" onClick={() => changePage('home')}>Home</Button>
                            <Button variant="primary" onClick={() => changePage('receipt')}>Split a Receipt</Button>
                            <Button variant="primary" onClick={() => {changePage('receipt'); handleShowPastReceipts(true)}}>View Past Receipts</Button>

                            <Box sx={{ flexGrow: 1 }}></Box>
                            <Auth user={user} setUser={setUser} cookies={cookies}/>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>
        </>
    );
}

