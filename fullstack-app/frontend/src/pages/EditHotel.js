import React, { useState } from 'react';

const EditHotel = ({ styles }) => {
  const [images, setImages] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleSubmitHotel = (e) => {
    e.preventDefault();
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
  };

  const handleCancelHotel = () => {
    setImages([]);
    setHotelName('');
    setHotelDescription('');
  };

  const handleCancelRoom = () => {
    setRoomName('');
    setRoomDescription('');
  };

  const isHotelFormFilled = hotelName || hotelDescription || images.length > 0;
  const isRoomFormFilled = roomName || roomDescription;

  return (
    <div style={styles.editHotelBlock}>
      <h2 style={styles.h2}>Редактировать гостиницу</h2>
      <form onSubmit={handleSubmitHotel}>
        <div style={styles.formGroup}>
          <input 
            type="text" 
            placeholder="Название гостиницы"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <textarea 
            placeholder="Описание гостиницы"
            value={hotelDescription}
            onChange={(e) => setHotelDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <input 
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <button type="submit" style={styles.saveButton}>
          Сохранить гостиницу
        </button>
        {isHotelFormFilled && (
          <button type="button" onClick={handleCancelHotel} style={styles.cancelButton}>
            Отменить
          </button>
        )}
        {isHotelFormFilled && (
          <button type="button" onClick={handleAddRoom} style={styles.addRoomButton}>
            Добавить номер
          </button>
        )}
      </form>

      <h2 style={styles.h2}>Добавить номер</h2>
      <form onSubmit={handleAddRoom}>
        <div style={styles.formGroup}>
          <input 
            type="text"
            placeholder="Название номера"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <textarea 
            placeholder="Описание номера"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.saveButton}>
          Сохранить номер
        </button>
        {isRoomFormFilled && (
          <button type="button" onClick={handleCancelRoom} style={styles.cancelButton}>
            Отменить
          </button>
        )}
      </form>
    </div>
  );
};

export default EditHotel;