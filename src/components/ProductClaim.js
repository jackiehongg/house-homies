import { React } from "react";
import { styled } from '@mui/material/styles';
import Checkbox from './Checkbox'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';



export default function ProductClaim({ members, products, checks, setChecks, handleDeleteProduct }) {

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0,
		},
	}));

	const handleClick = (e) => {
		const key = e.currentTarget.name
		const newChecks = { ...checks };
		if (!(key in newChecks)) newChecks[key] = 0
		else if (newChecks[key] === 0) newChecks[key] = 1
		else if (newChecks[key] === 1) newChecks[key] = 2
		else if (newChecks[key] === 2) newChecks[key] = 0

		setChecks(newChecks);
	}

	return (
		<>
			{members.length > 0 && products.length > 0 ?
				<>
					<TableContainer>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Product</TableCell>
									<TableCell>Value</TableCell>
									<TableCell>Purchaser</TableCell>
									{members.map((member) => (<TableCell key={member} align='right'>{member}</TableCell>))}
								</TableRow>
							</TableHead>
							<TableBody>
								{products.map((product) => (
									<StyledTableRow key={product['id']} sx={{ 'td ,th': { border: 0 }, borderBottom: 0 }}>
										<TableCell><a href='/' style={{ 'textDecoration': 'none', 'color': 'inherit' }} onClick={(e) => handleDeleteProduct(e, product['id'])} className='p-2 text-capitalize'>{product['label']}</a></TableCell>
										<TableCell>{product.value}</TableCell>
										<TableCell>{product.purchaser}</TableCell>
										{members.map((member) => (
											<TableCell key={member + product['id']} align='right'><Checkbox name={member + product['id']} state={checks[member + product['id']]} handleClick={handleClick} /></TableCell>
										))}
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer >
				</>
				:
				<>
					<Typography variant='h5'>Add your members and some products to get started!</Typography>
					<Box >
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</Box>
				</>
			}
		</>
	);
}
