//App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchRoom from './pages/SearchNamber';
import AllHotel from './pages/AllHotel';
import AddHotel from './pages/AddHotel';
import ChatIcon from './pages/ChatIcon';
import Profile from './pages/Profile';
import Users from './pages/Users';
import EditHotel from './pages/EditHotel';
import ProtectedRoute from './pages/ProtectedRoute';
import LoginRegistrationForm from './pages/LoginRegistrationForm';
import ArrowRightIcon from './img/Arrow - Right 2.png';
import ArrowBottomIcon from './img/Arrow - Bottom 2.png';
import IconUser from './img/cat-svgrepo-com 1.png';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px 16px',
    margin: '0 auto',
    maxWidth: '1200px',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
  },
  leftColumn: {
    flex: '0 0 auto',
    maxWidth: '303px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0 20px',
    marginRight: '20px',
  },
  rightColumn: {
    flex: '1',
    maxWidth: '100%',
    padding: '0 20px',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  logoContainer: {
    marginBottom: '20px',
    borderRadius: '8px',
    padding: '0 10px',
    backgroundColor: '#079AA2',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  logo: {
    width: '100%',
    maxWidth: '257px',
    height: '67px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'inter',
    textDecoration: 'none',
    color: '#DEE2E6',
  },
  menuContainer: {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '0 0 0 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  nav: {
    listStyleType: 'none',
    padding: '24px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
  },
  navItem: {
    marginBottom: '24px',
  },
  navItemContent: {
    display: 'flex',
  },
  navLink: {
    textDecoration: 'none',
    color: '#8A92A6',
    fontSize: '16px',
  },
  header: {
    height: '67px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginBottom: '20px',
    padding: '0 24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userIcon: {
    display: 'flex',
    width: '33px',
    height: '33px',
    backgroundColor: '#ccc',
    borderRadius: '8px',
  },
  iconUser: {
    height: 'auto',
    objectFit: 'cover',
    margin: 'auto',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  iconBottom: {
    width: '13px',
    height: '13px',
  },
  loginLink: {
    textDecoration: 'none',
    color: '#8A92A6',
    fontSize: '12px',
  },
  searchBlock: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  searchContainer: {
    maxWidth: '604px',
    margin: 'auto',
  },
  formGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  formGroupDate: {
    margin: '0 auto 0 0',
  },
  input: {
    color: '#8A92A6',
    width: '100%',
    maxWidth: '570px',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  searchButton: {
    width: 'auto',
    padding: '0 16px',
    height: '44px',
    backgroundColor: '#5D73E1',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  showPasswordButton: {
    width: 'auto',
    height: '18px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.3s',
  },
  h2: {
    textDecoration: 'none',
    color: '#232D42',
    fontSize: '25px',
  },
  h3: {
    textDecoration: 'none',
    color: '#8A92A6',
    fontSize: '18px',
  },
  aContainer: {
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  a: {
    textDecoration: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  loginContainer: {
    position: 'relative',
    maxWidth: '361px',
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    margin: '0 0 0 auto',
  },
  tableUsers: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    textAlign: 'left',
  },
};

const isAuthenticated = !!localStorage.getItem('jwtToken');
console.log("isAuthenticated:", isAuthenticated);

const App = () => {
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return (
    <div style={styles.container}>
      {/* Левый столбик */}
      <div style={styles.leftColumn}>
        <div style={styles.logoContainer}>
          <Link to="/" style={styles.logo}>logo</Link>
        </div>
        <div style={styles.menuContainer}>
          <nav>
            <ul style={styles.nav}>
              <li style={styles.navItem}>
                <Link to="/all-hotel" style={styles.navLink}>
                  <div style={styles.navItemContent}>
                    <img src={ArrowRightIcon} alt="Arrow Right" style={styles.icon} />
                    <div>Все гостиницы</div>
                  </div>
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/search-room" style={styles.navLink}>
                  <div style={styles.navItemContent}>
                    <img src={ArrowRightIcon} alt="Arrow Right" style={styles.icon} />
                    <div>Поиск номера</div>
                  </div>
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/add-hotel" style={styles.navLink}>
                  <div style={styles.navItemContent}>
                    <img src={ArrowRightIcon} alt="Arrow Right" style={styles.icon} />
                    <div>Добавить гостиницу</div>
                  </div>
                </Link>
              </li>
              {isAuthenticated && (
                <li style={styles.navItem}>
                  <Link to="/users" style={styles.navLink}>
                    <div style={styles.navItemContent}>
                      <img src={ArrowRightIcon} alt="Arrow Right" style={styles.icon} />
                      <div>Пользователи</div>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Правый столбик */}
      <div style={styles.rightColumn}>
        <div style={styles.header}>
          <div></div>
          <div style={styles.userContainer}>
            {!isAuthenticated && (
              <Link to="/login" style={styles.loginLink}>
                <div style={styles.navItemContent}>
                  <div>Войти</div>
                  <img src={ArrowBottomIcon} alt="Arrow Bottom" style={styles.iconBottom} />
                </div>
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/profile">
                <div style={styles.userIcon}>
                  <img src={IconUser} alt="User" style={styles.iconUser} />
                </div>
              </Link>
            )}
          </div>
        </div>

        <Routes>
          <Route path="/all-hotel" element={<AllHotel styles={styles} />} />
          <Route path="/add-hotel" element={<AddHotel styles={styles} />} />
          <Route path="/login" element={<LoginRegistrationForm styles={styles} />} />
          <Route path="/users" element={<Users styles={styles} />} />
          <Route path="/edit-hotel" element={<EditHotel styles={styles} />} />
          <Route path="/profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile styles={styles} />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<SearchRoom styles={styles} />} />
          <Route path="/search-room" element={<SearchRoom styles={styles} />} />
        </Routes>
      </div>
      <ChatIcon styles={styles.chatIcon} />
    </div>
  );
};

export default App;