import { useState } from "react";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
import ProductClaim from "./components/ProductClaim";
import Navbar from './components/Navbar'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


import Container from 'react-bootstrap/Container';


function App() {
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState([]);
  const [checks, setChecks] = useState({});
  const [debt, setDebt] = useState({})
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitMember = (e) => {
    e.preventDefault();
    setMembers([...members, e.target.member.value]);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    setItems([...items, e.target.item.value]);
    setValues([...values, e.target.value.value]);
    let newCheck = {};
    members.map((member) => {
      newCheck[member + index] = false;
      return null;
    });
    setIndex(index + 1);
    setChecks(Object.assign({}, checks, newCheck));
  };

  // useEffect(() => {console.log(checks);}, [checks]);

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    console.log(checks);

    const newDebt = {};
    for (const member of members) newDebt[member] = 0;
    for (let i = 0; i < index; i++) {
      let numClaims = 0;

      // Compute cost of split between members who claim
      for (const member of members) {
        numClaims = checks[member + i] ? numClaims + 1 : numClaims;
      }
      const share = values[i] / numClaims;

      // Update debts
      for (const member of members) {
        if (checks[member + i]) newDebt[member] = newDebt[member] + share;
        console.log(member + i)
      }
    }
    setDebt(newDebt)
    console.log(debt)
    handleShow()

  };

  return (
    <Container>
      <Navbar />
      <MemberForm members={members} handleSubmitMember={handleSubmitMember} />
      <ProductForm
        items={items}
        values={values}
        handleSubmitProduct={handleSubmitProduct}
      />
      {/* <ProductList items={items} values={values} /> */}
      <ProductClaim
        members={members}
        items={items}
        values={values}
        checks={checks}
        setChecks={setChecks}
        handleClaimSubmit={handleClaimSubmit}
      />
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
    </Container>
  );
}

export default App;

/* TODO
Beatify
Integrate flask server
Deploy
*/
