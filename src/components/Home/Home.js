import * as React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';

import FeatureCard from './FeatureCard'

export default function Home({ changePage }) {
    return (
        <>
            <Box sx={{ bgcolor: '', pt: 8, pb: 6, }}>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>HouseHomies</Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>Expenses shared, hassles spared.</Typography>
                    <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" onClick={() => changePage('receipt')}>Get Started</Button>
                        <Button component={Link} variant="outlined" target="_blank" href="https://github.com/jackiehongg/house-homies" rel="noreferrer">
                            <GitHubIcon sx={{color: "black"}} />Learn More
                        </Button>
                    </Stack>
                </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            heading={'Managing Expenses'}
                            body={'Add or remove members and items from your group before splitting'}
                            image={"/images/ManagingExpenses.png"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            heading={'Splitting the Bill'}
                            body={'Group members can check off expenses their involved in'}
                            image={"/images/SplittingTheBill.jpg"} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            heading={'Sharing With Others'}
                            body={'Create a share link for others to add their expenses to the group and check off their own'}
                            image={"/images/SharingWithOthers.png"} />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}