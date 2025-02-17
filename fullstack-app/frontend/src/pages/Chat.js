//Chat.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { user: 'User', text: message });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '10px' }}>Техподдержка</h2>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '10px',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Начните печатать"
        style={{
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: '10px',
          backgroundColor: '#5D73E1',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Отправить
      </button>
    </div>
  );
};

export default Chat;
