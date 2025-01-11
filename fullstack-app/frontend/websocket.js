// import { io } from 'socket.io-client';

// // Укажите адрес вашего сервера WebSocket
// const SOCKET_URL = 'http://localhost:3000'; // Адрес вашего бэкенда

// const socket = io(SOCKET_URL, {
//   transports: ['websocket'], // Указываем транспорт
//   reconnection: true,        // Автоматическое переподключение
//   reconnectionAttempts: 5,   // Количество попыток переподключения
// });

// export default socket;

import { io } from 'socket.io-client';

//URL бэкенд-сервера
const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
});

socket.emit('message', 'Hello from client!');

socket.on('message', (message) => {
  console.log('Received from server:', message);
});
