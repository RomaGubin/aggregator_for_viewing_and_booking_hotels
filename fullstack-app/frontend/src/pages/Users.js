//Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersList = ({ styles }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 20;

  const fetchUsers = async (page = 1, query = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        params: {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
          search: query.search || '',
        },
      });

      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
    } catch (error) {
      if (error.response.status === 401) {
        alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
      } else if (error.response.status === 403) {
        alert('У вас нет прав для просмотра этого списка.');
      } else {
        alert('Ошибка при загрузке пользователей');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, { search: searchQuery });
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, { search: searchQuery });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page, { search: searchQuery });
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
            <div style={{ backgroundColor: '#F5F6FA' }}>
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
                    key={user.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fff' : '#F5F6FA',
                    }}
                  >
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
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
