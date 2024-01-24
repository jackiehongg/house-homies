import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export default function ReceiptOffscreen({ show, handleToggleShow, user, handleLoadReceipt }) {

  const [receiptList, setReceiptList] = useState([])

  const handleUserReceipts = (e, id) => {
    e.preventDefault()
    axios.get('/receipts/' + id)
      .then(function (response) {
        const data = response.data
        handleLoadReceipt(data)
      }).catch(function (error) {
        console.log(error)
      });
  }

  useEffect(() => {
    if (user && show) {
      axios.get('/users/' + user.sub + '/receipts')
        .then(function (response) {
          setReceiptList(response.data)
        }).catch(function (error) {
          console.log(error)
        });
    }
  }, [user, show])

  return (
    <>
      <Offcanvas show={show} onHide={handleToggleShow}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Past Receipts</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {(receiptList) ? (
            (receiptList).map((receipt) => (
              <li>
                <Typography variant='span'>{receipt['title']} </Typography>
                <Button variant='primary' size='small' onClick={(e) => handleUserReceipts(e, receipt['_id']['$oid'])}>View</Button>
              </li>
            ))
          ) :
            ('No receipts found')
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
