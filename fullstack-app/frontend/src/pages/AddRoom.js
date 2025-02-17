//AddRoom.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddRoom = ({ styles }) => {
  const { id, roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    price: 0,
    images: []
  });

  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/hotels/${id}/rooms/${roomId}`);
          setRoomData(response.data);
        } catch (error) {
          console.error('Ошибка загрузки номера:', error);
          alert('Не удалось загрузить данные номера');
        }
      };
      fetchRoom();
    }
  }, [id, roomId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Требуется авторизация!');
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const formData = new FormData();
      formData.append('name', roomData.name);
      formData.append('description', roomData.description);
      formData.append('price', roomData.price);
  
      newImages.forEach((image) => {
        formData.append('images', image);
      });
  
      console.log('--- Отладочная информация ---');
      console.log('Headers:', headers);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await fetch(
        `http://localhost:3000/hotels/${id}/rooms`,
        {
          method: 'POST',
          body: formData,
          headers: {
            ...headers,
          },
        }
      );
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка сервера');
      }
  
      alert('Номер успешно добавлен!');
      navigate(`/hotel/${id}`);
  
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.message || 'Произошла ошибка при добавлении номера');
    }
  };

  const handleCancel = () => {
    navigate(`/hotel/${id}`);
  };

  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <h2 style={styles.h2}>{roomId ? 'Редактирование номера' : 'Добавление номера в отель'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Изображения номера</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.input}
            />
            <div>
            <h4 style={styles.h3}>Предпросмотр:</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {newImages.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Название номера</h3>
            <input
              type="text"
              placeholder="Введите название номера"
              value={roomData.name}
              onChange={e => setRoomData({...roomData, name: e.target.value})}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Описание номера</h3>
            <textarea
              placeholder="Введите описание номера"
              value={roomData.description}
              onChange={e => setRoomData({...roomData, description: e.target.value})}
              required
              style={{
                ...styles.input,
                height: '100px',
                resize: 'none',
              }}
            />
          </div>
          <h3 style={styles.h3}>Стоимость за сутки</h3>
          <div style={styles.formGroup}>
            <input
              type="number"
              placeholder="Стоимость за сутки"
              value={roomData.price}
              onChange={e => setRoomData({...roomData, price: Number(e.target.value)})}
              min="0"
              required
              style={{
                ...styles.input,
                width: '10%',
                resize: 'none',
              }}
            />
          </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              style={{
                ...styles.searchButton,
                backgroundColor: roomId ? '#1AA053' : '#5D73E1'
              }}
            >
              {roomId ? 'Сохранить изменения' : 'Добавить номер'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                ...styles.searchButton,
                backgroundColor: '#E15D5D',
                marginLeft: '10px'
              }}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;