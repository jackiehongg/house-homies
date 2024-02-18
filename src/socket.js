import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? 'https://house-homies-api.onrender.com' : 'http://127.0.0.1:10000';

export const socket = io(URL);