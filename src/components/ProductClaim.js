import { React, useEffect } from "react";

import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';


export default function ProductClaim({
  members,
  items,
  values,
  checks,
  setChecks,
  handleClaimSubmit,
}) {
  const pairs = items.map(function (item, i) {
    return [item, values[i]];
  });

  // TODO: Warning when adding member after item is created
  const handleClick = (e) => {
    const key = e.target.name;
    const newChecks = { ...checks };
    if (!newChecks[key]) newChecks[key] = false // Unnecessary?
    newChecks[key] = !newChecks[key];
    setChecks(newChecks);
  };

  useEffect(() => console.log(checks), [checks])

  return (
    <>
      <div className='fw-bolder fs-3'>Check off your items below</div>

      <Form onSubmit={handleClaimSubmit}>
        {pairs.map((pair, index) => {
          return (
            <>
              <Stack direction='horizontal' gap={5}>
                <div className='p-2 text-capitalize'>{pair[0]} {pair[1]}</div>
                <div className="='p-2' ms-auto">
                  {members.map((member) => (
                  <Form.Check
                    inline
                    // label={member}
                    name={member + index}
                    type="checkbox"
                    checked={checks[member + index]}
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
