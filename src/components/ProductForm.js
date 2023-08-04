import { React, useState } from "react";

export default function MemberForm({ items, values, handleSubmitProduct }) {
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
      handleSubmitProduct(e);
      setItem("");
      setValue("");
    }

  return (
    <>
      <h1>Add products found on this bill!</h1>
      <h1>Current items...</h1>
      <form onSubmit={handleSubmit}>
        <label>Item</label>
        <input
          name="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <label>Value</label>
        <input
          name="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
      {items ? items.map((item) => <li key={item}>{item}</li>) : <h5>None</h5>}
      {values ? values.map((value) => <li key={value}>{value}</li>) : <h5>None</h5>}
    </>
  );
}
