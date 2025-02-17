//EditHotel.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditHotel = ({ styles }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    images: []
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/hotels/${id}`);
        setHotelData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки отеля:', error);
        alert('Не удалось загрузить данные отеля');
      }
    };
    fetchHotel();
  }, [id]);

  const handleSubmitHotel = async (e) => {
    e.preventDefault();
    
    if (!hotelData.name.trim() || !hotelData.description.trim()) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', hotelData.name);
      formData.append('description', hotelData.description);
      
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      await axios.put(`http://localhost:3000/hotels/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      alert('Отель успешно обновлен!');
      navigate(`/hotel/${id}`);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении отеля');
    }
  };

  const handleDeleteImage = async (imageName) => {
    try {
      await axios.delete(`http://localhost:3000/hotels/${id}/images`, {
        data: { imageName },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      
      setHotelData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageName)
      }));
    } catch (error) {
      console.error('Ошибка удаления изображения:', error);
    }
  };

  const isFormFilled = hotelData.name || hotelData.description || newImages.length > 0;

  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <div style={styles.formGroup}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {hotelData.images?.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={`http://localhost:3000/uploads/${image}`}
                  alt={`hotel-${index}`}
                  style={{ 
                    width: '100px', 
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image)}
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
        
        <h3 style={styles.h2}>Добавить изображения</h3>
        <div style={styles.formGroup}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          {newImages.length > 0 && (
            <div>
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
          )}
        </div>

        <h3 style={styles.h2}>Название отеля</h3>
        <form onSubmit={handleSubmitHotel}>
          <div style={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Название гостиницы"
              value={hotelData.name}
              onChange={(e) => setHotelData({ ...hotelData, name: e.target.value })}
              style={styles.input} 
              required
            />
          </div>

          <h3 style={styles.h2}>Описание отеля</h3>
          <div style={styles.formGroup}>
            <textarea 
              placeholder="Описание гостиницы"
              value={hotelData.description}
              onChange={(e) => setHotelData({ ...hotelData, description: e.target.value })}
              style={{
                ...styles.input,
                height: '100px',
                resize: 'none',
              }}
              required
            />
          </div>
          <div style={{display: 'flex'}}>
            <button type="submit" style={{
              ...styles.searchButton,
              backgroundColor: '#1AA053',
              }}>
              Сохранить
            </button>
            {isFormFilled && (
              <button 
              type="button" 
              onClick={() => navigate(`/hotel/${id}`)}
              style={{ 
                ...styles.searchButton, 
                backgroundColor: '#E15D5D',
                marginLeft: '10px',
                }}>
                Отменить
              </button>
            )}
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default EditHotel;
