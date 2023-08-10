import { React, useState, useRef } from "react";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ProductForm({ handleSubmitProduct }) {
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");

  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitProduct(e);
    setItem("");
    setValue("");
  }

  return (
    <>
      <div className='fw-bolder fs-3'>Add products</div>
      <Form onSubmit={(e) => { handleSubmit(e); inputRef.current.focus(); }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Label</InputGroup.Text>
            <Form.Control type="text" name="item" ref={inputRef}
              value={item}
              onChange={(e) => setItem(e.target.value)} />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
            <Form.Control type="number" placeholder="0" name="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Button variant="outline-primary" type="submit" >
          Submit
        </Button>
      </Form>
    </>
  );
}
