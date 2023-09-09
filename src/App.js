import { useEffect, useState } from "react";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
import ProductClaim from "./components/ProductClaim";
import NavbarMenu from './components/NavbarMenu';
import ShareLink from './components/ShareLink';
import Debts from './components/Debts';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools()


function App() {
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

  const URLparams = new URLSearchParams(window.location.search)
  const URLreceiptid = URLparams.get('receiptid')

  useEffect(() => {
    console.log(URLreceiptid)
    if (URLreceiptid) {
      axios.get(URLreceiptid + '/receipts')
        .then(function (response) {
          const data = response.data
          handleLoadReceipt(data)
        }).catch(function (error) {
          console.log(error)
        });
    }
  }, [URLreceiptid]);

  const handleLoadReceipt = (data) => {
    setMembers(data['members'])
    setProducts(data['products'])
    setChecks(data['checks'])
    setDebt(data['debt'])
    setReceiptID(data['_id']['$oid'])
  }

  const handleSubmitMember = (e) => {
    e.preventDefault();
    setMembers([...members, e.target.member.value]);
    const newCheck = {}
    for (const product of products) {
      newCheck[e.target.member.value + product['id']] = 0
    }
    setChecks(Object.assign({}, checks, newCheck))
  };

  const handleDeleteMember = (e, member) => {
    e.preventDefault();
    const newMembers = [...members]
    newMembers.splice(newMembers.indexOf(member), 1)
    setMembers(newMembers)
    const newChecks = { ...checks }
    for (const product of products) {
      delete newChecks[member + product['id']]
    }
    setChecks(newChecks)
  }

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    const newItem = { 'id': uuidv4(), 'label': e.target.item.value, 'value': e.target.value.value }
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

  const handleClaimSubmit = (e) => {
    e.preventDefault();

    const newDebt = {};
    for (const member of members) newDebt[member] = 0;

    // For every product, calculate sum of claims on an item and determine share as value / claims * checks
    for (const product of products) {
      let numClaims = 0

      for (const member of members) {
        numClaims = numClaims + checks[member + product['id']]
      }

      for (const member of members) {
        let share = product['value'] / numClaims * checks[member + product['id']]
        if (checks[member + product['id']] > 0) newDebt[member] += share
      }

    }

    setDebt(newDebt)
    handleShowDebts()
  };

  const handleSaveChanges = async (e) => {

    const body = {
      "username": user ? user['username'] : null,
      "members": members,
      "products": products,
      "checks": checks,
      "debt": debt,
    }

    let id = null
    if (receiptID) {
      await axios.put(receiptID + '/save_changes', body)
        .then(function (response) {
          id = response.data
          setReceiptID(id)
        }).catch(function (error) {
          console.log(error)
        });
    } else {
      await axios.post('/save_changes', body)
        .then(function (response) {
          id = response.data
          setReceiptID(id)
        }).catch(function (error) {
          console.log(error)
        });
    }

    if (process.env.NODE_ENV !== 'production')
      setShareLink('http://localhost:3000/?receiptid=' + id)
    else
      setShareLink('https://house-homies-api.onrender.com/?receiptid=' + id)
  }

  const handleShare = (e) => {
    handleShowShareLink()
  }

  return (
    <Container>
      <NavbarMenu setUser={setUser} user={user} handleLoadReceipt={handleLoadReceipt} />
      <MemberForm members={members} handleSubmitMember={handleSubmitMember} handleDeleteMember={handleDeleteMember} />
      <ProductForm handleSubmitProduct={handleSubmitProduct} />
      <ProductClaim
        members={members}
        products={products}
        checks={checks}
        setChecks={setChecks}
        handleClaimSubmit={handleClaimSubmit}
        handleDeleteProduct={handleDeleteProduct}
      />
      <Debts debt={debt} showDebts={showDebts} handleCloseDebts={handleCloseDebts} />
      <ShareLink shareLink={shareLink} showShareLink={showShareLink} handleCloseShareLink={handleCloseShareLink} />
      <br></br>
      <Button variant='outline-secondary' onClick={handleSaveChanges} >Save Changes</Button>
      <Button variant='outline-secondary' onClick={handleShare} disabled={receiptID ? false : true}>Share</Button>

    </Container>
  );
}

export default App;


