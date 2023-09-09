import { React } from "react";

import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Checkbox from './Checkbox'

export default function ProductClaim({ members, products, checks, setChecks, handleClaimSubmit, handleDeleteProduct }) {

  // const handleClick = (e) => {
  //   console.log(e)
  //   const key = e.target.name;
  //   const newChecks = { ...checks };
  //   if (!newChecks[key]) newChecks[key] = false
  //   newChecks[key] = !newChecks[key];
  //   setChecks(newChecks);
  // };

  const handleClick = (e) => {
    const key = e.currentTarget.name
    const newChecks = { ...checks };
    if (!(key in newChecks)) newChecks[key] = 0
    else if (newChecks[key] === 0) newChecks[key] = 1
    else if (newChecks[key] === 1) newChecks[key] = 2
    else if (newChecks[key] === 2) newChecks[key] = 0
  
    setChecks(newChecks, console.log(checks));

  }

  return (
    <>
      <div className='fw-bolder fs-3'>Check off your items below</div>
      <Form onSubmit={handleClaimSubmit}>
        {products.map((product) => {
          return (
            <>
              <Stack direction='horizontal' gap={3}>
                <a href='/' style={{ 'textDecoration': 'none', 'color': 'inherit' }} onClick={(e) => handleDeleteProduct(e, product['id'])} className='p-2 text-capitalize'>{product['label']} {product['value']}</a>
                <div className="='p-2' ms-auto">
                  {/* {members.map((member) => (
                    <Form.Check
                      inline
                      key={member + product['id']}
                      name={member + product['id']}
                      type="checkbox"
                      checked={checks[member + product['id']]}
                      onChange={handleClick}
                    />
                  ))} */}
                  <Stack name='stack' direction='horizontal' gap={5}>
                    {members.map((member) => (
                    <Checkbox
                      key={member + product['id']}
                      name={member + product['id']}
                      state={checks[member + product['id']]}
                      handleClick={handleClick}
                    />
                  ))}
                  </Stack>
                  
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
