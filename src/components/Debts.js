import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpIcon from '@mui/icons-material/Help';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


export default function Debts({ members, products, debt, showDebts, handleCloseDebts }) {
    const [tab, setTab] = useState(0)

    const handleChangeTab = (e, newTab) => {
        setTab(newTab);
    }

    const calculateTotalcost = (products) => {
        let sum = 0
        for (const product of products) {
            sum += product['value']
        }
        return sum.toFixed(2)
    }

    const calculatePaidFor = (member) => {
        let sum = 0
        for (const product of products) {
            if (product['purchaser'] === member) sum += product['value']
        }
        return sum.toFixed(2)
    }

    const calculateOwed = (member) => {
        let sum = 0
        for (const buyer of Object.keys(debt[member])) {
            if (buyer !== member) sum += debt[member][buyer]
        }
        return sum.toFixed(2)
    }

    const calculateSpent = (member) => {
        let sum = 0
        for (const purchaser of Object.keys(debt)) {
            sum += debt[purchaser][member]
        }
        return sum.toFixed(2)
        
    }


    return (
        <>
            <Dialog
                open={showDebts}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDebts}
                aria-describedby="alert-dialog-slide-description"
                maxWidth="xl"
            >
                <DialogTitle>Settling up</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab label="Overview" />
                                {members.map((member) => (<Tab key={member} label={member}></Tab>))}
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tab} index={0}>
                            <Typography variant="body1">Total Cost: ${calculateTotalcost(products)}</Typography>
                            <Typography variant="body1">Total Items: {products.length}</Typography>
                        </CustomTabPanel>
                        {Object.keys(debt).map((member, index) => (
                            <CustomTabPanel key={member} value={tab} index={index + 1}>
                                <Typography variant="body1">Total Cost: ${calculateTotalcost(products)}</Typography>
                                <Typography variant="body1">You paid for ${calculatePaidFor(member)}</Typography>
                                <Typography variant="body1">You are owed ${calculateOwed(member)}</Typography>
                                <Typography variant="body1">You spent ${calculateSpent(member)}</Typography>
                            </CustomTabPanel>
                        ))}
                    </Box>
                    <br></br>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    <TableCell>Purchaser</TableCell>
                                    {Object.keys(debt).map((member) => (<TableCell key={member} align="right">{member}</TableCell>))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(debt).map((purchaser) =>
                                    <TableRow key={purchaser}>
                                        <TableCell>{purchaser}</TableCell>
                                        {Object.keys(debt).map((spender) => (<TableCell key={spender} align="right">{debt[purchaser][spender]}</TableCell>))}
                                    </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography color='action' variant='body2'><HelpIcon color='action' fontSize='small' />Reading along a row tells you how much you are owed, while down a column is how much you owe.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseDebts}>OK</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
