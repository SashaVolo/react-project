import { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../../context/AuthContext';
import logoImg from "./../../assets/logoHeader.svg"

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Відправка форми...", { email, password, firstName, secondName });
    // Тут буде логіка fetch запиту до сервера
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation запобігає закриттю при кліку всередині вікна */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2 className={styles.title}>
          {isLogin ? 'Вхід' : 'Реєстрація'}
        </h2>
              <img className={styles.img} src={logoImg} alt='logo'></img>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          {!isLogin && (
            <div className={styles.row}>
              <input
                type="text"
                placeholder="Ім'я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Прізвище"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.submitButton}>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>{isLogin ? "Немає акаунту? " : "Вже є акаунт? "}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className={styles.toggleButton}
          >
            {isLogin ? 'Створити' : 'Увійти'}
          </button>
        </div>

      </div>
    </div>
  );
}