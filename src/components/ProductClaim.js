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



export default function ProductClaim({ members, products, checks, handleClaim, handleDeleteProduct }) {

	const OutlinedBadgeLink = ({ href, onClick, label }) => {
		return (
			<a 
				href={href}
				onClick={onClick}
				style={{
					display: 'inline-block',
					padding: '6px 12px',
					borderRadius: '12px',
					border: '2px solid #007bff', // Blue border for the badge
					backgroundColor: '#ffffff', // White background
					color: '#007bff', // Blue text for the default state
					textDecoration: 'none',
					fontWeight: 'bold',
					textAlign: 'center',
					fontSize: '0.875rem',
					lineHeight: '1.5',
					transition: 'all 0.3s', // Smooth transition for all changes
					cursor: 'pointer',
					whiteSpace: 'nowrap',
				}}
				onMouseOver={(e) => {
					e.currentTarget.style.backgroundColor = '#ffcccc'; // Light red background on hover
					e.currentTarget.style.color = '#ff0000'; // Red text on hover
					e.currentTarget.style.borderColor = '#ff0000'; // Red border on hover
				}}
				onMouseOut={(e) => {
					e.currentTarget.style.backgroundColor = '#ffffff'; // White background on hover out
					e.currentTarget.style.color = '#007bff'; // Blue text on hover out
					e.currentTarget.style.borderColor = '#007bff'; // Blue border on hover out
				}}
			>
				{label}
			</a>
		);
	};

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0,
		},
	}));

	return (
		<>
			{members.length > 0 && products.length > 0 ?
				<>
					<TableContainer>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Expense</TableCell>
									<TableCell>Value</TableCell>
									<TableCell>Purchaser</TableCell>
									{members.map((member) => (<TableCell key={member} align='right'>{member}</TableCell>))}
								</TableRow>
							</TableHead>
							<TableBody>
								{products.map((product) => (
									<StyledTableRow key={product['id']} sx={{ 'td ,th': { border: 0 }, borderBottom: 0 }}>
										<TableCell><OutlinedBadgeLink href='/' onClick={(e) => handleDeleteProduct(e, product.id)}label={product.label}/></TableCell>
										<TableCell>{product.value}</TableCell>
										<TableCell>{product.purchaser}</TableCell>
										{members.map((member) => (
											<TableCell key={member + product['id']} align='right'><Checkbox name={member + product['id']} state={checks[member + product['id']]} handleClaim={handleClaim} /></TableCell>
										))}
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer >
					<br></br>
				</>
				:
				<>
					<Typography variant='h5'>Add your members and some expenses to get started!</Typography>
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
