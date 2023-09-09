import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios';

export default function ReceiptOffscreen({ show, handleToggleShow, user, handleLoadReceipt }) {

  const handleUserReceipts = (e, id) => {
    e.preventDefault()
    axios.get(id + '/receipts')
        .then(function (response) {
          const data = response.data
          handleLoadReceipt(data)
        }).catch(function (error) {
          console.log(error)
        });
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleToggleShow}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Past Receipts</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {(user && user['receipts']) ? (
            user['receipts'].map((receipt) => (
              <li>
                {receipt['$oid']}
                <Button variant='primary' onClick={(e) => handleUserReceipts(e, receipt['$oid'])}>View</Button>
              </li>
            ))
          ) :
            ('No user')
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
