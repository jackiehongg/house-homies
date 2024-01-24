import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';


if (process.env.NODE_ENV !== 'production')
  axios.defaults.baseURL = 'http://localhost:5000/';
else axios.defaults.baseURL = 'https://house-homies-api.onrender.com/';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="250752119853-au1j8j4ce349vpnfihimbhire0hjmk1g.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
