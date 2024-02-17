import { useEffect, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

export default function Auth({ user, setUser, cookies }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = (jwt_token) => {
        const jwt_decoded = jwtDecode(jwt_token)
        setUser(jwt_decoded)
        cookies.set('jwt_auth', jwt_token, {})
        setIsLoggedIn(true)
    }

    const logout = () => {
        setUser(null)
        cookies.remove('jwt_auth')
        setIsLoggedIn(false)
    }

    useEffect(() => {
        const jwt_token = cookies.get('jwt_auth')
        if (jwt_token) login(jwt_token)
    }, [])


    return (
        <>
            {isLoggedIn ? (
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <>
                            <Button {...bindTrigger(popupState)}>
                                <Chip
                                    avatar={<Avatar src={user.picture} alt={user.name}/>}
                                    label={user.given_name}
                                    color='primary'
                                    variant="filled"
                                    size='medium'
                                />
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => { logout(); popupState.close() }}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </PopupState>
            ) : (
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        login(credentialResponse.credential);
                    }}
                    onError={() => {
                        console.log('Login Failed')
                    }}
                />
            )}
        </>
    )
}
