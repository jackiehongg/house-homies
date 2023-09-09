import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

export default function Debts({showDebts, debt, handleCloseDebts}) {
    return (
        <Modal debt={debt} show={showDebts} onHide={handleCloseDebts}>
            <Modal.Header closeButton>
                <Modal.Title>Share Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>{Object.keys(debt).map((key, index) => (
                <p key={index}> {key}: {Math.round(debt[key] * 100) / 100}</p>
            ))}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDebts}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
