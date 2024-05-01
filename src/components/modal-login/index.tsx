import React, { useState } from 'react';
import styles from './styles.module.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = () => {
    onLogin(username, password);
  };

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalContent}>
        <h2>Login</h2>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className={styles.inputField}
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.loginButton} type="button" onClick={handleLoginClick}>
              Login
            </button>
            <button className={styles.closeButton} type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
