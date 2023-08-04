import { useState } from "react";
import MemberForm from "./components/MemberForm";
import ProductForm from "./components/ProductForm";
// import ProductList from "./components/ProductList";
import ProductClaim from "./components/ProductClaim";

function App() {
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState([]);
  const [checks, setChecks] = useState({});
  const [index, setIndex] = useState(0);
  // const [progress, setProgress] = useState(0);

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
    console.log(e.target);
    console.log(e.target.jackie0.checked);
    console.log(e.target.angela0.checked);
    console.log(checks);

    const debt = {};
    for (const member of members) debt[member] = 0;
    for (let i = 0; i < index; i++) {
      let numClaims = 0;

      // Compute cost of split between members who claim
      for (const member of members) {
        numClaims = checks[member + i] ? numClaims + 1 : numClaims;
      }
      const share = values[i] / numClaims;

      // Update debts
      for (const member of members) {
        if (checks[member + i]) debt[member] = debt[member] + share;
        console.log(member + i)
      }
    }

    alert(JSON.stringify(debt));
  };

  return (
    <>
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
    </>
  );
}

export default App;

/* TODO
Create calculations
Beatify
Integrate flask server
Deploy
*/
