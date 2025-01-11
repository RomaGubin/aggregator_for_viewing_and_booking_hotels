//SearchNamber.js
import React, { useState } from 'react';

const SearchRoom = ({ styles }) => {
  const [hotelName, setHotelName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();

    fetch(`/api/common/hotel-rooms?limit=10&offset=0&hotel=${hotelName}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        console.error(err);
        alert('Произошла ошибка при поиске.');
      });
  };

  return (
    <div style={styles.searchBlock}>
    <div style={styles.searchContainer}>
      <h2 style={styles.h2}>Поиск гостиницы</h2>
      <form onSubmit={handleSearch}>
        <div style={styles.formGroup}>
          <input 
            type="text" 
            placeholder="Введите название гостиницы"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <div style={styles.formGroupDate}>
            <h3 style={styles.h3}>Заезд</h3>
            <input 
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              style={styles.input} 
            />
          </div>
          <div style={styles.formGroupDate}>
            <h3 style={styles.h3}>Выезд</h3>
            <input 
              type="date" 
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              style={styles.input} 
            />
          </div>
        </div>
        <button type="submit" style={styles.searchButton}>
          Искать
        </button>
      </form>
      
      <div>
        <h3 style={styles.h3}>Результаты поиска:</h3>
        <ul>
          {results.map((room) => (
            <li key={room.id}>
              {room.hotel.title} - {room.description}
              <img src={room.images[0]} alt={room.description} style={{ width: '100px' }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
};


export default SearchRoom;
