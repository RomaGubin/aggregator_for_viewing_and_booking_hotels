// AllHotel.js
import React, { useState, useEffect } from 'react';

const AllHotel = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch('/api/hotels')
      .then((res) => res.json())
      .then((data) => setHotels(data));
  }, []);

  return (
    <div>
      <h1>Все гостиницы</h1>
      {hotels.map((hotel) => (
        <div key={hotel._id}>
          <h2>{hotel.name}</h2>
          <p>{hotel.location}</p>
        </div>
      ))}
    </div>
  );
};

export default AllHotel;
