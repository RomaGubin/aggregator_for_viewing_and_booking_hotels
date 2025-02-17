//Users.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = ({ styles }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 20;

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/users/admin', {
        params: {
          offset: String((page - 1) * itemsPerPage),
          limit: String(itemsPerPage),
          search: searchQuery?.trim() || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });;

      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
    } catch (error) {
      console.error('Ошибка получения пользователей:', error);
      if (error.response) {
        console.log('Статус ошибки:', error.response.status);
        console.log('Данные ошибки:', error.response.data);
        
        if (error.response.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
          localStorage.removeItem('jwtToken');
          window.location.reload();
        } else if (error.response.status === 403) {
          alert('Недостаточно прав для просмотра списка пользователей');
        } else {
          alert('Ошибка сервера: ' + (error.response.data.message || 'Неизвестная ошибка'));
        }
      } else {
        alert('Нет соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchQuery]);
  
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  return (
    <div style={styles.searchBlock}>
      <div style={styles.searchContainer}>
        <h1>Пользователи</h1>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Введите имя пользователя, id, телефон или почту"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          onClick={handleSearch}
          style={styles.searchButton}
        >
          Искать
        </button>

        {isLoading ? (
          <div style={{ marginTop: '20px' }}>Загрузка...</div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div style={{ backgroundColor: '#F5F6FA', overflowX: 'auto' }}>
              <table
                style={styles.tableUsers}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Телефон</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#fff' : '#F5F6FA',
                      }}
                    >
                      <td>
                        <Link 
                          to={`/user/${user._id}`} 
                          style={{ 
                            color: '#5D73E1', 
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {user._id}
                        </Link>
                      </td>
                      <td>{user.name}</td>
                      <td>{user.contactPhone || 'Не указан'}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={styles.showPasswordButton}
              >
                Назад
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={styles.showPasswordButton}
              >
                Далее
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
