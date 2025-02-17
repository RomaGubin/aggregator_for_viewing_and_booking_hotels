//AllHotel.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AllHotel = ({ styles }) => {
  const [hotels, setHotels] = useState([]);
  
  const user = useSelector(state => state.auth.user); 

  useEffect(() => {
    fetch('http://localhost:3000/hotels')
      .then((res) => res.json())
      .then((data) => setHotels(data));
  }, []);

  return (
    <div>
      <h1>Все гостиницы</h1>
      {hotels.map((hotel) => (
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
              <div style={styles.buttonGroup}>
              <Link 
                to={`/hotel/${hotel._id}`}
                style={{ 
                  ...styles.searchButton, 
                  textDecoration: 'none' 
                }}>
                Подробнее
              </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllHotel;