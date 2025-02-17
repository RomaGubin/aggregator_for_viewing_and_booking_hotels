//ChatIcon.js
import React, { useState } from 'react';
import Chat from './Chat';
import IconUser from '../img/chat 1.png';

const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      <img
        src={IconUser}
        alt="Chat Icon"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => setIsChatOpen(true)}
      />

      {isChatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '300px',
            height: '400px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={() => setIsChatOpen(false)}
            style={{
              alignSelf: 'flex-end',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              margin: '10px',
              cursor: 'pointer',
            }}
          >
            ✖
          </button>
          <Chat />
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
