import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const User = ({ styles }) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          axios.get(`http://localhost:3000/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          }),
          axios.get(`http://localhost:3000/bookings/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
          })
        ]);
        
        setUser(userRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div style={styles.searchBlock}>
      <h1 style={{ marginBottom: '20px' }}>
        Бронирования пользователя: {user?.name}
      </h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.tableUsers}>
          <thead>
            <tr>
              <th>ID бронирования</th>
              <th>Отель</th>
              <th>Дата заезда</th>
              <th>Дата выезда</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>
                  <Link to={`/hotel/${booking.hotelId}`}>
                    {booking.hotelId}
                  </Link>
                </td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;