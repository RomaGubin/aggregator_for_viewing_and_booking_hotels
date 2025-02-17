import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const Hotel = ({ styles }) => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const hotelResponse = await fetch(`http://localhost:3000/hotels/${id}`);
        if (!hotelResponse.ok) throw new Error('Отель не найден');
        
        const hotelData = await hotelResponse.json();
        setHotel(hotelData);
        setRooms(hotelData.rooms || []);
        
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const userResponse = await fetch('http://localhost:3000/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) setUser(await userResponse.json());
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={styles.loading}>Загрузка...</div>;
  if (!hotel) return <div style={styles.error}>Отель не найден</div>;

  return (
    <div>
      <div style={{ ...styles.searchBlock, marginBottom: '10px' }}>
      {/* Основное большое изображение */}
        <div style={styles.mainImageContainer}>
          {hotel.images?.length > 0 && (
            <img
              src={`http://localhost:3000/uploads/${hotel.images[selectedImage]}`}
              alt="main"
              style={styles.mainImage}
            />
          )}
        </div>

      <div 
        ref={containerRef}
        style={styles.thumbnailContainer}
      >
        {hotel.images?.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:3000/uploads/${image}`}
            alt={`thumbnail-${index}`}
            style={{
              ...styles.thumbnail,
              border: selectedImage === index ? '3px solid #2196F3' : 'none'
            }}
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </div>

      <div style={styles.infoContainer}>
        <h1 style={styles.h2}>{hotel.name}</h1>
        <p>{hotel.description}</p>

        {isAuthenticated && user?.role === 'admin' && (
          <div style={styles.buttonGroup}>
            <Link
              to={`/hotel/${id}/edit`}
              style={{
                ...styles.searchButton,
                backgroundColor: '#E1855D',
                textDecoration: 'none',
                }}>
              Редактировать отель
            </Link>
            
            <Link
              to={`/hotel/${id}/add-room`}
              style={{
                ...styles.searchButton,
                textDecoration: 'none',
                }}>
              Добавить номер
            </Link>
          </div>
        )}
        </div>
      </div>
      {/* Блок с номерами */}
        <div>
          {rooms.map(room => (
            <div key={room._id.$oid} style={{ ...styles.searchBlock, marginBottom: '10px' }}>
              <div style={{ ...styles.mainImageContainer, width: '50%',}}>
                {room.images?.map((img, index) => (
                  <img
                  src={`http://localhost:3000/uploads/${img}`}
                  alt={`room-${index}`}
                  style={styles.mainImage}
                  />
                ))}
              </div>
              
              <div style={styles.infoContainer}>
                <h1 style={styles.h2}>{room.name}</h1>
                <p>{room.description}</p>
                <div>
                  <span>{room.price} ₽ / ночь</span>
                  <div style={styles.buttonGroup}>
                    {isAuthenticated && user?.role === 'admin' && (
                      <Link
                        to={`/hotel/${id}/edit-room/${room._id}`}
                        style={{
                          ...styles.searchButton,
                          backgroundColor: '#E1855D',
                          textDecoration: 'none',
                          marginTop: '10px',
                          }}
                      >
                        Редактировать
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Hotel;