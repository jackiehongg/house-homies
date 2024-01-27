import Cookies from 'universal-cookie';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'

import Title from "./components/Title";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
import ProductClaim from "./components/ProductClaim";
import NavbarMenu from './components/NavbarMenu';
import ShareLink from './components/ShareLink';
import Debts from './components/Debts';

if (process.env.NODE_ENV === 'production') disableReactDevTools()

function App() {
	const [title, setTitle] = useState('New Receipt')
	const [members, setMembers] = useState([]);
	const [products, setProducts] = useState([]);
	const [checks, setChecks] = useState({});
	const [debt, setDebt] = useState({})
	const [showDebts, setShowDebts] = useState(false);
	const [showShareLink, setShowShareLink] = useState(false);
	const [shareLink, setShareLink] = useState(null);
	const [receiptID, setReceiptID] = useState(null)
	const [user, setUser] = useState(null)

	const handleShowShareLink = () => setShowShareLink(true);
	const handleCloseShareLink = () => setShowShareLink(false);

	const handleShowDebts = () => setShowDebts(true);
	const handleCloseDebts = () => setShowDebts(false);

	const cookies = new Cookies();
	const base_url = process.env.NODE_ENV === 'production' ? 'https://house-homies.onrender.com' : 'http://localhost:3000'
	// document.body.style.backgroundColor = '#f5f5f5'
	const URLparams = new URLSearchParams(window.location.search)
	const URLreceiptid = URLparams.get('receiptid')

	useEffect(() => {
		const title = cookies.get('title')
		const members = cookies.get('members')
		const products = cookies.get('products')
		const checks = cookies.get('checks')
		const receiptID = cookies.get('receiptid')

		if (title) setTitle(title)
		if (members) setMembers(members)
		if (products) setProducts(products)
		if (checks) setChecks(checks)
		if (receiptID) setReceiptID(receiptID)
	}, [])

	useEffect(() => {
		if (URLreceiptid) {
			axios.get('/receipts/' + URLreceiptid)
				.then(function (response) {
					const data = response.data
					handleLoadReceipt(data)
				}).catch(function (error) {
					console.log(error)
				});
		}
	}, [URLreceiptid]);

	const handleLoadReceipt = (data) => {
		setTitle(data['title'])
		setMembers(data['members'])
		setProducts(data['products'])
		setChecks(data['checks'])
		setDebt(data['debt'])
		setReceiptID(data['_id']['$oid'])
	}

	const handleSubmitMember = (e) => {
		e.preventDefault();
		const member = (e.target.member.value).charAt(0).toUpperCase() + (e.target.member.value).slice(1)
		setMembers([...members, member]);
		const newCheck = { ...checks }
		for (const product of products) {
			newCheck[member + product['id']] = 0
		}
		setChecks(newCheck)
	};

	const handleDeleteMember = (e, member) => {
		e.preventDefault();

		const newChecks = { ...checks }
		for (const product of products) {
			if (product['purchaser'] === member) {
				for (const member of members) {
					delete newChecks[member + product['id']]
				}
			} else {
				delete newChecks[member + product['id']]
			}
		}

		const newProducts = products.filter((product) => { return product['purchaser'] !== member })

		const newMembers = [...members]
		newMembers.splice(newMembers.indexOf(member), 1)

		setMembers(newMembers)
		setProducts(newProducts)
		setChecks(newChecks)
	}

	const handleSubmitProduct = (e) => {
		e.preventDefault();
		const newItem = { 'id': uuidv4(), 'label': e.target.label.value, 'value': parseFloat(e.target.value.value), 'purchaser': e.target.purchaser.value }
		const newProducts = [...products, newItem]
		setProducts(newProducts);
		const newChecks = {}
		members.forEach((member) => { newChecks[member + newItem['id']] = 0 });
		setChecks(Object.assign({}, checks, newChecks))
	}

	const handleDeleteProduct = (e, targetID) => {
		e.preventDefault()
		const newProducts = [...products]
		const idx = newProducts.findIndex(({ id }) => id === targetID)
		products.splice(idx, 1)

		const newChecks = { ...checks };
		for (const member of members) {
			delete newChecks[member + targetID]
		}
		setChecks(newChecks)
	}

	const handleCalculateDebt = (e) => {
		e.preventDefault();
		// members: [m1, m2, m3, ...]
		// products: [{id: pid, label: l1, value: v1, purchaser, m1}, ...]
		// checks: {m1+id: weight, ...}

		const newDebt = {}

		for (const member of members) {
			newDebt[member] = {}
			for (const member2 of members) {
				newDebt[member][member2] = 0
			}
		}

		for (const product of products) {
			let numClaims = 0
			for (const member of members) {
				numClaims = numClaims + checks[member + product['id']]
			}

			for (const member of members) {
				let share = product['value'] / numClaims * checks[member + product['id']]
				if (checks[member + product['id']] > 0) {
					newDebt[product['purchaser']][member] += share
				}

			}
		}

		for (const purchaser of Object.keys(newDebt)) {
			for (const member of Object.keys(newDebt[purchaser])) {
				newDebt[purchaser][member] = parseFloat(newDebt[purchaser][member].toFixed(2))
			}
		}

		setDebt(newDebt)
		handleShowDebts()
	};

	const handleSaveChanges = async (e) => {
		const body = {
			"owner": user ? user.sub : null,
			"title": title,
			"members": members,
			"products": products,
			"checks": checks,
			"debt": debt,
		}

		cookies.set('title', title, {})
		cookies.set('members', members, {})
		cookies.set('products', products, {})
		cookies.set('checks', checks, {})
		cookies.set('receiptid', receiptID, {})
		cookies.set('title', title, {})

		// If saving existing receipt else saving new receipt
		let id = null
		if (receiptID) {
			await axios.put('/receipts/' + receiptID, body)
				.then(function (response) {
					id = response.data
					setReceiptID(id)
				}).catch(function (error) {
					console.log(error)
				});
		} else {
			await axios.post('/receipts', body)
				.then(function (response) {
					id = response.data
					setReceiptID(id)
				}).catch(function (error) {
					console.log(error)
				});
		}

	}

	const handleReset = (e) => {
		setTitle('New Receipt')
		setMembers([])
		setProducts([])
		setChecks({})
		setDebt({})
		setReceiptID(null)

		cookies.remove('title')
		cookies.remove('members')
		cookies.remove('products')
		cookies.remove('checks')
		cookies.remove('receiptid')
	}

	const handleShare = (e) => {
		handleSaveChanges()
		setShareLink(base_url + '/?receiptid=' + receiptID)
		handleShowShareLink()
	}

	return (
		<Box>
			<NavbarMenu user={user} setUser={setUser} handleLoadReceipt={handleLoadReceipt} cookies={cookies}/>
			<Container>
				<Title title={title} setTitle={setTitle} />
				<MemberForm members={members} debt={debt} handleSubmitMember={handleSubmitMember} handleDeleteMember={handleDeleteMember} />
				<ProductForm handleSubmitProduct={handleSubmitProduct} members={members} />
				<ProductClaim members={members} products={products} checks={checks} setChecks={setChecks} handleDeleteProduct={handleDeleteProduct} />

				<br></br>
				<Stack direction="row" spacing={1}>
					<Button variant='contained' onClick={handleCalculateDebt}>Split</Button>
					<Button variant='outlined' onClick={handleSaveChanges} >Save Changes</Button>
					<Button variant='outlined' onClick={handleShare} disabled={receiptID ? false : true}>Share</Button>
					<Box sx={{flexGrow: 1}}></Box>
					<Button variant='outlined' color="warning" onClick={handleReset}>Create New Without Saving</Button>					
				</Stack>

				<Debts members={members} products={products} debt={debt} showDebts={showDebts} handleCloseDebts={handleCloseDebts} />
				<ShareLink shareLink={shareLink} showShareLink={showShareLink} handleCloseShareLink={handleCloseShareLink} />
			</Container>
		</Box>
	);
}

export default App;


