import Cookies from 'universal-cookie';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ObjectId from 'bson-objectid'
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { socket } from './socket'
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'

import Home from "./components/Home/Home"
import Title from "./components/Title";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
import ProductClaim from "./components/ProductClaim";
import NavbarMenu from './components/NavbarMenu';
import ShareLink from './components/ShareLink';
import Debts from './components/Debts';
import PastReceipts from './components/PastReceipts';

if (process.env.NODE_ENV === 'production') disableReactDevTools()

function App() {
	const cookies = new Cookies();
	const [page, setPage] = useState('home')
	const [title, setTitle] = useState('New Receipt')
	const [members, setMembers] = useState([])
	const [products, setProducts] = useState([])
	const [checks, setChecks] = useState({})
	const [debt, setDebt] = useState({})
	const [receiptID, setReceiptID] = useState(cookies.get('receiptid') ? cookies.get('receiptid') : ObjectId().toString())
	const [showDebts, setShowDebts] = useState(false)
	const [showShareLink, setShowShareLink] = useState(false)
	const [showPastReceipts, setShowPastReceipts] = useState(false)
	const [shareLink, setShareLink] = useState(null)
	const [user, setUser] = useState(null)
	const [afterInitialLoad, setAfterInitialLoad] = useState(false)
	const handleShowShareLink = () => setShowShareLink(true);
	const handleCloseShareLink = () => setShowShareLink(false);

	const handleShowDebts = () => setShowDebts(true);
	const handleCloseDebts = () => setShowDebts(false);

	const base_url = process.env.NODE_ENV === 'production' ? 'https://house-homies.onrender.com' : 'http://localhost:3000'
	const URLparams = new URLSearchParams(window.location.search)
	const URLreceiptid = URLparams.get('receiptid')

	// Sockets
	useEffect(() => {
		socket.emit("join_receipt", receiptID)
	}, [receiptID])

	useEffect(() => {
		socket.on('updated_receipt', (data) => {
			setTitle(data['title'])
			setMembers(data['members'])
			setProducts(data['products'])
			setChecks(data['checks'])
		})
	}, [socket])

	// On login sync
	useEffect(() => {
		if (afterInitialLoad && user) {
			axios.put('/users/' + receiptID, { "user": user })
				.then(function (response) { })
				.catch(function (error) {
					console.log(error)
				});
		}
	}, [user])

	// Cookies
	useEffect(() => {
		const title = cookies.get('title')
		const members = cookies.get('members')
		const products = cookies.get('products')
		const checks = cookies.get('checks')

		if (title) setTitle(title)
		if (members) setMembers(members)
		if (products) setProducts(products)
		if (checks) setChecks(checks)

		setAfterInitialLoad(true)
	}, [])

	useEffect(() => {
		if (afterInitialLoad) {
			cookies.set('title', title, {})
			cookies.set('members', members, {})
			cookies.set('products', products, {})
			cookies.set('checks', checks, {})
			cookies.set('receiptid', receiptID, {})
		}
	}, [title, members, products, checks, receiptID])

	// Use Share Link
	useEffect(() => {
		if (URLreceiptid) {
			axios.get('/receipts/' + URLreceiptid)
				.then(function (response) {
					const data = response.data
					handleLoadReceipt(data)
				}).catch(function (error) {
					console.log(error)
				});
			changePage('receipt')
		}
	}, [URLreceiptid]);

	const changePage = (newPage) => {
		setPage(newPage)
	}

	const handleLoadReceipt = (data) => {
		setTitle(data['title'])
		setMembers(data['members'])
		setProducts(data['products'])
		setChecks(data['checks'])
		setReceiptID(data['_id']['$oid'])
	}

	// Form Operations
	const handleTitleChange = (e) => {
		e.preventDefault()
		const newTitle = e.target.value
		setTitle(newTitle)
		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': newTitle, 'members': members, 'products': products, 'checks': checks })
	}

	const handleSubmitMember = (e) => {
		e.preventDefault();
		const member = (e.target.member.value).charAt(0).toUpperCase() + (e.target.member.value).slice(1)
		const newMembers = [...members, member]
		setMembers(newMembers);
		const newChecks = { ...checks }
		for (const product of products) {
			newChecks[member + product['id']] = 0
		}
		setChecks(newChecks)
		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': title, 'members': newMembers, 'products': products, 'checks': newChecks })
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

		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': title, 'members': newMembers, 'products': newProducts, 'checks': newChecks })
	}

	const handleSubmitProduct = (e) => {
		e.preventDefault();
		const newItem = { 'id': uuidv4(), 'label': e.target.label.value, 'value': parseFloat(e.target.value.value), 'purchaser': e.target.purchaser.value }
		const newProducts = [...products, newItem]
		setProducts(newProducts);
		var newChecks = {}
		members.forEach((member) => { newChecks[member + newItem['id']] = 0 });
		newChecks = Object.assign({}, checks, newChecks)
		setChecks(newChecks)

		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': title, 'members': members, 'products': newProducts, 'checks': newChecks })
	}

	const handleDeleteProduct = (e, targetID) => {
		e.preventDefault()
		const newProducts = [...products]
		const idx = newProducts.findIndex(({ id }) => id === targetID)
		newProducts.splice(idx, 1)
		setProducts(newProducts)

		const newChecks = { ...checks };
		for (const member of members) {
			delete newChecks[member + targetID]
		}
		setChecks(newChecks)

		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': title, 'members': members, 'products': newProducts, 'checks': newChecks })
	}

	const handleClaim = (e) => {
		const key = e.currentTarget.name
		const newChecks = { ...checks };
		if (!(key in newChecks)) newChecks[key] = 0
		else if (newChecks[key] === 0) newChecks[key] = 1
		else if (newChecks[key] === 1) newChecks[key] = 2
		else if (newChecks[key] === 2) newChecks[key] = 0

		setChecks(newChecks);
		socket.emit('update_receipt', { 'user': user, 'receiptID': receiptID, 'title': title, 'members': members, 'products': products, 'checks': newChecks })
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

	const handleReset = (e) => {
		setTitle('New Receipt')
		setMembers([])
		setProducts([])
		setChecks({})
		setDebt({})
		setReceiptID(ObjectId().toString())

		cookies.remove('title')
		cookies.remove('members')
		cookies.remove('products')
		cookies.remove('checks')
		cookies.remove('receiptid')
	}

	const handleShare = () => {
		setShareLink(base_url + '/?receiptid=' + receiptID)
		handleShowShareLink()
	}

	const handleShowPastReceipts = (bool) => {
		setShowPastReceipts(bool)
	}

	return (
		<Box>
			<NavbarMenu user={user} setUser={setUser} handleShowPastReceipts={handleShowPastReceipts} changePage={changePage} cookies={cookies} />
			{page === 'home' && (
				<Container>
					<Home changePage={changePage} />
				</Container>
			)}
			{page === 'receipt' && (
				<Container>
					<Title title={title} handleTitleChange={handleTitleChange} />
					<MemberForm members={members} debt={debt} handleSubmitMember={handleSubmitMember} handleDeleteMember={handleDeleteMember} />
					<ProductForm handleSubmitProduct={handleSubmitProduct} members={members} />
					<ProductClaim members={members} products={products} checks={checks} handleClaim={handleClaim} handleDeleteProduct={handleDeleteProduct} />

					<br></br>
					<Stack direction="row" spacing={1}>
						<Button variant='contained' onClick={handleCalculateDebt}>Split</Button>
						<Button variant='outlined' onClick={handleShare} disabled={receiptID ? false : true}>Share</Button>
						<Box sx={{ flexGrow: 1 }}></Box>
						<Button variant='outlined' color="warning" onClick={handleReset}>Create New Without Saving</Button>
					</Stack>

					<Debts members={members} products={products} debt={debt} showDebts={showDebts} handleCloseDebts={handleCloseDebts} />
					<PastReceipts showPastReceipts={showPastReceipts} handleShowPastReceipts={handleShowPastReceipts} user={user} handleLoadReceipt={handleLoadReceipt} />
					<ShareLink shareLink={shareLink} showShareLink={showShareLink} handleCloseShareLink={handleCloseShareLink} />
				</Container>
			)}
		</Box>
	);
}

export default App;


