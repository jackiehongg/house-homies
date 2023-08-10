import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Nav } from 'react-bootstrap';
import axios from 'axios';


export default function Login({ show, handleToggleShow, setUser }) {
    const [login, setLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showLoginAlert, setShowLoginAlert] = useState(false)
    const [showRegisterAlert, setShowRegisterAlert] = useState(false)

    const handletoggleLogin = (e) => {
        e.preventDefault()
        setLogin(!login)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        const body = {
            "username": username,
            "password": password
        }

        axios.post('/login', body)
            .then(function (response) {
                const newUser = response.data
                setUser(newUser)
                setShowLoginAlert(false)
                handleToggleShow()
            }).catch(function (error) {
                setShowLoginAlert(true)
                console.log(error)
            });
    }

    const handleRegister = (e) => {
        e.preventDefault()

        const body = {
            "username": username,
            "password": password
        }

        axios.post('/register', body)
            .then(function (response) {
                const newUser = response.data
                setUser(newUser)
                setShowRegisterAlert(false)
            }).catch(function (error) {
                console.log(error)
                setShowRegisterAlert(true)
            });
    }
    return (
        <>
            <Modal show={show} onHide={handleToggleShow}>
                <Modal.Header closeButton>
                    <Modal.Title>{login ? 'Log In' : 'Register'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {login ?
                        (<Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password (optional)</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Form.Text style={{'color':'red'}}>
                                    {showLoginAlert ? 'Account not found. Check your username and password.' : ''}
                                </Form.Text>
                            </Form.Group>
                            <Button className='p-2 mr-auto' variant="primary" type='submit'>Log In</Button>
                        </Form>) :
                        (<Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <Form.Text style={{'color':'red'}}>
                                    {showRegisterAlert ? 'This usename is already taken. Try another.' : ''}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password (optional)</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Form.Text className="text-muted">
                                    A password is optional. Implementing proper accounts later.
                                </Form.Text>
                            </Form.Group>
                            <Button className='p-2 mr-auto' variant="primary" type='submit'>Register</Button>
                        </Form>)
                    }
                </Modal.Body>
                <Modal.Footer>
                    {login ?
                        (<Nav.Link className='p-2 me-auto text-decoration-underline fw-light' onClick={handletoggleLogin}>Don't have an account? Sign up</Nav.Link>) :
                        (<Nav.Link className='p-2 me-auto text-decoration-underline fw-light' onClick={handletoggleLogin}>Already have an account? Login</Nav.Link>)}

                </Modal.Footer>
            </Modal>
        </>
    );
}
