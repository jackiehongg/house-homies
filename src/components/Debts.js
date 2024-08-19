import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
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

const OrangeTableCell = styled(TableCell)({
    color: 'orange',
});

const BlueTableCell = styled(TableCell)({
    color: 'blue',
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


export default function Debts({ members, products, debt, showDebts, handleShowDebts }) {
    const [tab, setTab] = useState(0)
    const [simplify, setSimplify] = useState(true)
    const [simpleDebt, setSimpleDebt] = useState({})

    const handleChangeTab = (e, newTab) => {
        setTab(newTab);
    }

    const handleToggleSimplify = () => {
        setSimplify(!simplify)
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

    useEffect(() => {
        let simpleDebt = structuredClone(debt)
        for (let purchaser in debt) {
            for (let debtor in debt[purchaser]) {
                if (purchaser == debtor) {
                    simpleDebt[purchaser][debtor] = 0
                } else if (debt[purchaser][debtor] > debt[debtor][purchaser]) {
                    simpleDebt[purchaser][debtor] = parseFloat((debt[purchaser][debtor] - debt[debtor][purchaser]).toFixed(2))
                    simpleDebt[debtor][purchaser] = parseFloat(0)
                } else {
                    simpleDebt[debtor][purchaser] = parseFloat((debt[debtor][purchaser] - debt[purchaser][debtor]).toFixed(2))
                    simpleDebt[purchaser][debtor] = parseFloat(0)
                }
            }
        }
        setSimpleDebt(simpleDebt)
    }, [debt]);


    return (
        <>
            <Dialog
                open={showDebts}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleShowDebts}
                aria-describedby="alert-dialog-slide-description"
                maxWidth="xl"
            >
                <DialogTitle>Settling up</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tab} onChange={handleChangeTab} aria-label="tab group">
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

                    {/*  unsimplified debt*/}
                        <Box style={{ display: !simplify ? 'block' : 'none', }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="unsimplified table">
                                    <TableHead>
                                        <TableRow >
                                            <TableCell>Purchaser</TableCell>
                                            {Object.keys(debt).map((member) => (<OrangeTableCell key={member} align="left">{member}</OrangeTableCell>))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(debt).map((purchaser) =>
                                            <TableRow key={purchaser}>
                                                <BlueTableCell>{purchaser}</BlueTableCell>
                                                {Object.keys(debt).map((spender) => (<TableCell key={spender} align="left">{debt[purchaser][spender]}</TableCell>))}
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                    {/*  simplified debt*/}

                        <Box style={{ display: simplify ? 'block' : 'none', }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="simplified table">
                                    <TableHead>
                                        <TableRow >
                                            <TableCell>Purchaser</TableCell>
                                            {Object.keys(simpleDebt).map((member) => (<OrangeTableCell key={member} align="left">{member}</OrangeTableCell>))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(simpleDebt).map((purchaser) =>
                                            <TableRow key={purchaser}>
                                                <BlueTableCell>{purchaser}</BlueTableCell>
                                                {Object.keys(simpleDebt).map((spender) => (<TableCell key={spender} align="left">{simpleDebt[purchaser][spender]}</TableCell>))}
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                    <Box display="flex" justifyContent="center" alignItems="center" ><FormControlLabel control={<Switch onChange={handleToggleSimplify} defaultChecked />} label={simplify ? "Simplified": "Simplify"} /></Box>
                    <Typography color='action' variant='body2'><HelpIcon color='action' fontSize='small' />Simplify helps minimize back and forth transactions. <span style={{ color: 'orange' }}>Orange Names</span> owe <span style={{ color: 'blue' }}>Blue Names</span> the amount where they intersect on the table.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleShowDebts}>OK</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
