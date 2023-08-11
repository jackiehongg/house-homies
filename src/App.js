import { useState } from "react";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
import ProductClaim from "./components/ProductClaim";
import NavbarMenu from './components/NavbarMenu'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools()

axios.defaults.baseURL = 'https://house-homies-api.onrender.com/';

function App() {
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [checks, setChecks] = useState({});
  const [debt, setDebt] = useState({})
  const [show, setShow] = useState(false);
  const [receiptID, setReceiptID] = useState(null)
  const [user, setUser] = useState(null)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleViewReceipt = (data) => {
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
      newCheck[e.target.member.value+product['id']] = false
    }
    setChecks(Object.assign({}, checks, newCheck))
  };

  const handleDeleteMember = (e, member) => {
    e.preventDefault();
    const newMembers = [...members]
    newMembers.splice(newMembers.indexOf(member), 1)
    setMembers(newMembers)
    const newChecks = {...checks}
    for (const product of products) {
      delete newChecks[member+product['id']]
    }
    setChecks(newChecks)
  }

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    const newItem = { 'id': uuidv4(), 'label': e.target.item.value, 'value': e.target.value.value }
    const newProducts = [ ...products, newItem ]
    setProducts(newProducts);
    const newChecks = {}
    members.forEach((member) => {newChecks[member + newItem['id']] = false});
    setChecks(Object.assign({}, checks, newChecks))
  }

  const handleDeleteProduct = (e, targetID) => {
    e.preventDefault()

    const newProducts = [...products]
    const idx = newProducts.findIndex(({id}) => id === targetID)
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

    // For every product, calculate evenly split share of product's value among members who claim and add to debt.
    for (const product of products) {
      let numClaims = 0

      for (const member of members) {
        numClaims = checks[member + product['id']] ? numClaims + 1 : numClaims
      }

      let share = product['value'] / numClaims
      for (const member of members) {
        if (checks[member + product['id']]) {
          newDebt[member] += share
        }
      }
    }

    setDebt(newDebt)
    handleShow()
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    const body = {
      "username": user['username'],
      "members": members,
      "products": products,
      "checks": checks,
      "debt": debt,
    }

    if (receiptID) {
      axios.put(receiptID + '/save_changes', body)
        .then(function (response) {
          const id = response.data
          setReceiptID(id)
        }).catch(function (error) {
          console.log(error)
        });
    } else {
      axios.post('/save_changes', body)
        .then(function (response) {
          const id = response.data
          setReceiptID(id)
        }).catch(function (error) {
          console.log(error)
        });
    }
  }

  return (
    <Container>
      <NavbarMenu setUser={setUser} user={user} handleViewReceipt={handleViewReceipt} />
      <MemberForm members={members} handleSubmitMember={handleSubmitMember} handleDeleteMember={handleDeleteMember} />
      <ProductForm handleSubmitProduct={handleSubmitProduct}/>
      <ProductClaim
        members={members}
        products={products}
        checks={checks}
        setChecks={setChecks}
        handleClaimSubmit={handleClaimSubmit}
        handleDeleteProduct={handleDeleteProduct}
      />

      {/* Move this into own component */}
      <Modal debt={debt} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Splits</Modal.Title>
        </Modal.Header>
        <Modal.Body>{Object.keys(debt).map((key, index) => (
          <p key={index}> {key}: {Math.round(debt[key] * 100) / 100}</p>
        ))}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <br></br>
      <Button variant='secondary' onClick={handleSaveChanges}>Save Changes</Button>
    </Container>
  );
}

export default App;


