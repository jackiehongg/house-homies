import { React } from "react";

import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export default function ProductClaim({ members, products, checks, setChecks, handleClaimSubmit, handleDeleteProduct }) {

  // TODO: Warning when adding member after item is created
  const handleClick = (e) => {
    const key = e.target.name;
    const newChecks = { ...checks };
    if (!newChecks[key]) newChecks[key] = false // Unnecessary?
    newChecks[key] = !newChecks[key];
    setChecks(newChecks);
  };

  return (
    <>
      <div className='fw-bolder fs-3'>Check off your items below</div>
      <Form onSubmit={handleClaimSubmit}>
        {products.map((product) => {
          return (
            <>
              <Stack direction='horizontal' gap={5}>
                <a href='/' style={{ 'textDecoration': 'none', 'color': 'inherit' }} onClick={(e) => handleDeleteProduct(e, product['id'])} className='p-2 text-capitalize'>{product['label']} {product['value']}</a>
                <div className="='p-2' ms-auto">
                  {members.map((member) => (
                    <Form.Check
                      inline
                      key={member + product['id']}
                      name={member + product['id']}
                      type="checkbox"
                      checked={checks[member + product['id']]}
                      onChange={handleClick}
                    />
                  ))}
                </div>
              </Stack>
            </>
          );
        })}
        <br />
        <Button variant='outline-primary' type="submit">Finalize</Button>
      </Form>
    </>
  );
}
