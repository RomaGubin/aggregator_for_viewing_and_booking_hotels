// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
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
    <div>
      <h2>Личный кабинет</h2>
      <div>
        <strong>Имя пользователя:</strong> {user.username}
      </div>
      <div>
        <strong>Роль:</strong> {user.role}
      </div>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Profile;
