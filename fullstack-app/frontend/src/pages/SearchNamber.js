// SearchNamber.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const SearchRoom = ({ styles, isAuthenticated }) => {
  const navigate = useNavigate();
  const [hotelName, setHotelName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    
    fetch('http://localhost:3000/auth/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
    })
    .then((response) => {
      if (response.status === 401) {
        setUser(null);
        return;
      } 
      return response.json();
    })
    .then((data) => {
      setUser(data || null);
    })
    .catch(() => setUser(null));
  }, [isAuthenticated]);

  const validateDates = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Укажите даты заезда и выезда');
      return false;
    }
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    
    if (start >= end) {
      setError('Дата выезда должна быть после даты заезда');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;
  
    setIsLoading(true);
  
    try {
      const params = {
        checkInDate,
        checkOutDate
      };

      if (hotelName.trim()) {
        params.hotelName = hotelName.trim();
      }
      console.log('Фронт hotelName:', hotelName);
      console.log('Фронт checkInDate:', checkInDate);
      console.log('Фронт checkOutDate:', checkOutDate);
  
      const response = await axios.get('http://localhost:3000/hotels/search/rooms', {
        params
      });
      console.log('Ответ сервера:', response.data);

      if (response.data.message) {
        setResults([]);
        alert(response.data.message);
      } else {
        setResults(response.data.hotels || []);
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      alert(error.response?.data?.message || 'Ошибка при поиске');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (hotelId, roomId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      
      const bookingData = {
        hotelId,
        roomId,
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString()
      };
      
      await axios.post(
        'http://localhost:3000/bookings',
        bookingData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      alert('Номер успешно забронирован!');
      handleSearch();
    } catch (error) {
      console.error('Full error details:', {
        response: error.response?.data,
        request: error.request,
        config: error.config
      });
    }
  };

  return (
    <div>
      <div style={{ ...styles.searchBlock, marginBottom: '10px' }}>
        <div style={styles.searchContainer}>
          <h2 style={styles.h2}>Поиск гостиницы</h2>
          <form onSubmit={handleSearch}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
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
            
            <button 
              type="submit" 
              style={styles.searchButton}
              disabled={isLoading}
            >
              {isLoading ? 'Поиск...' : 'Искать'}
            </button>
          </form>
        </div>
      </div>
      
      <div>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : results.length > 0 ? (
          results.map((hotel) => (
            <div key={hotel._id} style={{ ...styles.searchBlock, marginBottom: '10px' }}>
              <div style={styles.hotelContainer}>
                <div style={styles.hotelImageContainer}>
                  {hotel.images?.length > 0 && (
                    <img
                      src={`http://localhost:3000/uploads/${hotel.images[0]}`}
                      alt={hotel.name}
                      style={styles.hotelImage}
                    />
                  )}
                </div>
                
                <div style={styles.hotelInfoContainer}>
                  <h2>{hotel.name}</h2>
                  <p>{hotel.description}</p>
                  
                  <h3>Доступные номера:</h3>
                  <div style={styles.roomsGrid}>
                    {hotel.rooms?.map((room) => (
                      <div key={room._id} style={styles.roomCard}>
                        <div style={styles.roomImage}>
                          {room.images?.[0] && (
                            <img
                              src={`http://localhost:3000/uploads/${room.images[0]}`}
                              alt={room.name}
                              style={styles.roomThumbnail}
                            />
                          )}
                        </div>
                        <div style={styles.roomDetails}>
                          <h4>{room.name}</h4>
                          <p>{room.description}</p>
                          <p>Цена: {room.price} руб./ночь</p>
                          <button
                            onClick={() => handleBooking(hotel._id, room._id)}
                            style={styles.bookButton}
                            disabled={!isAuthenticated}
                          >
                            {!isAuthenticated 
                              ? 'Войдите для бронирования'
                              : 'Забронировать'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={styles.buttonGroup}>
                    <Link 
                      to={`/hotel/${hotel._id}`}
                      style={{ 
                        ...styles.searchButton, 
                        textDecoration: 'none' 
                      }}
                    >
                      Подробнее об отеле
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Нет доступных вариантов по вашему запросу</p>
        )}
      </div>
    </div>
  );
};

SearchRoom.propTypes = {
  styles: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default SearchRoom;