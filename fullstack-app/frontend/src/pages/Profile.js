// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ( {styles} ) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    console.log(localStorage.getItem('jwtToken'))
    if (!token) {
      navigate('/login');
    }
  
    fetch('http://localhost:3000/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("Полученные данные:", data);
        setUser(data);
      })
      .catch((error) => {
        setError('Ошибка при загрузке данных');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Перейти к входу</button>
      </div>
    );
  }

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <h2 style={styles.h2} >Личный кабинет</h2>
        <div>
          <strong>Имя пользователя:</strong> {user.name}
        </div>
        <div>
          <strong>Роль:</strong> {user.role}
        </div>
        <button onClick={handleLogout}
        style={{ 
          ...styles.searchButton, 
          backgroundColor: '#E15D5D',
          marginTop: '10px',
          }}>
        Выйти</button>
      </div>
    </div>
  );
};

export default Profile;
