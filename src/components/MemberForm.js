import { React, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function MemberForm({ members, handleSubmitMember, handleDeleteMember }) {
  const [name, setName] = useState("");

  return (
    <>
      <div className='fw-bolder fs-3'>Add members</div>
      <Form onSubmit={(e) => {handleSubmitMember(e); setName('');}}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
            <Form.Control type="text" name="member"
              value={name}
              onChange={(e) => setName(e.target.value)} />
          </InputGroup>

          <Form.Text className="text-muted">
            {members ? (
              members.map(function (member, index) {
                return <a href='/' className='text-capitalize' style={{'textDecoration': 'none', 'color': 'inherit'}} onClick={(e) => handleDeleteMember(e, member)}key={member}>{(index ? ', ' : '') + member}</a>;
              })
            ) : (
              <h5>None</h5>
            )}
          </Form.Text>
        </Form.Group>

        <Button variant="outline-primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}
