//AddHotel.js
import React, { useState } from 'react';

const AddHotel = ({ styles }) => {
  const [images, setImages] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    formData.append('title', hotelName);
    formData.append('description', hotelDescription);

    fetch('/api/admin/hotels', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Отель успешно добавлен!');
        setImages([]);
        setHotelName('');
        setHotelDescription('');
      })
      .catch((err) => {
        console.error(err);
        alert('Произошла ошибка при добавлении отеля.');
      });
  };

  const handleCancel = () => {
    setImages([]);
    setHotelName('');
    setHotelDescription('');
  };

  const isFormFilled = hotelName || hotelDescription || images.length > 0;


  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <h2 style={styles.h2}>Добавить гостиницу</h2>
        <form onSubmit={handleSubmit}>
          {/* Загрузка изображений */}
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Добавить изображения</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.input}
            />
          </div>
          {/* Предпросмотр загруженных изображений */}
          <div style={styles.formGroup}>
            {images.length > 0 && (
              <div>
                <h4 style={styles.h3}>Предпросмотр:</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {images.map((img, index) => (
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
          {/* Название отеля */}
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Название гостиницы</h3>
            <input
              type="text"
              placeholder="Введите название гостиницы"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              style={styles.input}
            />
          </div>
          {/* Описание отеля */}
          <div style={styles.formGroup}>
            <h3 style={styles.h3}>Описание гостиницы</h3>
            <textarea
              placeholder="Введите описание гостиницы"
              value={hotelDescription}
              onChange={(e) => setHotelDescription(e.target.value)}
              style={{
                ...styles.input,
                height: '100px',
                resize: 'none',
              }}
            />
          </div>
          <button type="submit" style={styles.searchButton}>
            Добавить
          </button>
          {isFormFilled && (
            <button type="button" onClick={handleCancel} 
            style={{ 
              ...styles.searchButton, 
              backgroundColor: '#E15D5D',
              marginLeft: '10px',
              }}>
              Отменить
            </button>
          )}

        </form>
      </div>
    </div>
  );
};

export default AddHotel;
