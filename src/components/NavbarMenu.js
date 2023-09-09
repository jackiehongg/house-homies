import { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Login from './Login';
import ReceiptOffscreen from './ReceiptOffscreen';

export default function NavbarMenu({ setUser, user, handleLoadReceipt }) {

    const [showLogin, setShowLogin] = useState(false);
    const [showOffscreen, setShowOffscreen] = useState(false);

    const handleToggleShowLogin = () => setShowLogin(!showLogin);
    const handleToggleShowOffscreen = () => setShowOffscreen(!showOffscreen);
    const handleLogout = () => setUser(null)

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>HouseHomies</Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={handleToggleShowOffscreen}>Receipts</Nav.Link>
                            <Nav.Link onClick={handleToggleShowLogin}>{user ? 'Logged in as ' + user['username'] : 'Login'}</Nav.Link>
                            <Nav.Link onClick={handleLogout}>{user ? 'Logout' : ''}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Login setUser={setUser} show={showLogin} handleToggleShow={handleToggleShowLogin} />
            <ReceiptOffscreen show={showOffscreen} handleToggleShow={handleToggleShowOffscreen} user={user} handleLoadReceipt={handleLoadReceipt}/>
        </>
    );
}

