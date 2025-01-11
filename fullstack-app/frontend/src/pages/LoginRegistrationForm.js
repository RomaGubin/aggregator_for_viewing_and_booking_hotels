//LoginRegistrationForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/features/authSlice';
import axios from 'axios';

const LoginRegistrationForm = ({ styles }) => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', name: '', phone: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Проверка совпадения паролей при регистрации
    if (isRegister && formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      setIsLoading(false);
      return;
    }
  
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const requestData = isRegister
        ? {
            email: formData.username,
            password: formData.password,
            name: formData.name,
            role: 'user',
          }
        : {
            email: formData.username,
            password: formData.password,
          };
  
      if (formData.phone) {
        requestData.phone = formData.phone;
      }
  
      const { data } = await axios.post(`http://localhost:3000${endpoint}`, requestData);
  
      if (data?.token) {
        localStorage.setItem('jwtToken', data.token);
      } else {
        alert('Ошибка: Токен не был возвращен от сервера');
        return;
      }
  
      dispatch(setCredentials({ user: data.user, token: data.token }));
  
      alert('Успешно!');
  
      if (data.user?.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/profile';
      }
    } catch (error) {
      if (error.response) {
        alert(`Ошибка: ${error.response.data?.message || 'Неизвестная ошибка'}`);
      } else if (error.request) {
        alert('Ошибка при отправке запроса на сервер');
      } else {
        alert(`Ошибка: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.aContainer}>
        <div>
          <a
            onClick={() => setIsRegister(false)}
            style={{
              ...styles.a,
              color: isRegister ? '#2E46BA' : '#000',
              textDecoration: isRegister ? 'none' : 'underline',
            }}
          >
            Войти
          </a>
        </div>
        <div>
          <a
            onClick={() => setIsRegister(true)}
            style={{
              ...styles.a,
              color: isRegister ? '#000' : '#2E46BA',
              textDecoration: isRegister ? 'underline' : 'none',
            }}
          >
            Зарегистрироваться
          </a>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <input
            type="text"
            placeholder="Введите email"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={styles.input}
          />
        </div>

        {isRegister && (
          <>
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Введите имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Введите номер телефона"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                style={styles.showPasswordButton}
              >
                {passwordVisible ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            <div style={styles.formGroup}>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                style={styles.showPasswordButton}
              >
                {confirmPasswordVisible ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </>
        )}

        {!isRegister && (
          <div style={styles.formGroup}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              style={styles.showPasswordButton}
            >
              {passwordVisible ? 'Скрыть' : 'Показать'}
            </button>
          </div>
        )}

        <button
          type="submit"
          style={styles.searchButton}
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginRegistrationForm;