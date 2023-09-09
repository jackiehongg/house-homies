import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

export default function ShareLink({shareLink, showShareLink, handleCloseShareLink}) {
    return (
        <Modal show={showShareLink} onHide={handleCloseShareLink}>
            <Modal.Header closeButton>
                <Modal.Title>Share Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>{shareLink}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseShareLink}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
