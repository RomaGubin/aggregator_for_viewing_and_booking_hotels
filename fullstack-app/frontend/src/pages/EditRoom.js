//EditRoom.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditRoom = ({ styles }) => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    price: 0,
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/hotels/${hotelId}/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          }
        );
        setRoomData(response.data);
        setExistingImages(response.data.images || []);
      } catch (error) {
        console.error('Ошибка загрузки номера:', error);
        alert('Не удалось загрузить данные номера');
      }
    };
    fetchRoom();
  }, [hotelId, roomId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Требуется авторизация!');
        return;
      }

      const formData = new FormData();
      formData.append('name', roomData.name);
      formData.append('description', roomData.description);
      formData.append('price', roomData.price.toString());

      newImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.put(
        `http://localhost:3000/hotels/${hotelId}/rooms/${roomId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        alert('Номер успешно обновлен!');
        navigate(`/hotel/${hotelId}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.response?.data?.message || 'Ошибка при обновлении номера');
    }
  };

  const handleDeleteImage = async (imageName) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(
        `http://localhost:3000/hotels/${hotelId}/rooms/${roomId}/images`,
        {
          data: { imageName },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setExistingImages(prev => prev.filter(img => img !== imageName));
    } catch (error) {
      console.error('Ошибка удаления изображения:', error);
    }
  };

  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <h2 style={styles.h2}>{'Редактирование номера'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {existingImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={`http://localhost:3000/uploads/${img}`}
                      alt={`existing-${index}`}
                      style={{ 
                        width: '100px', 
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.input}
            />
            <div>
              <h4 style={styles.h3}>Новые изображения:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {newImages.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    style={{ 
                      width: '100px', 
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
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
                backgroundColor: '#1AA053'
              }}
            >
              Сохранить изменения
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/hotel/${hotelId}`)}
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

export default EditRoom;