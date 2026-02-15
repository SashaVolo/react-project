import { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../../context/AuthContext';

const EMOJI_AVATARS = [
    "🦁", "🦊", "🐱", "🐶", "🦄", "🐸", "😎", "👾",
    "🤖", "💀", "👻", "👽", "💩", "🤡", "👹", "🎃",
    "🤠", "🧠", "👀", "🐼", "🐯", "🐲"
];

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

    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successName, setSuccessName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const baseUrl = 'http://127.0.0.1:8000';
        const endpoint = isLogin ? '/login' : '/register';

        let body;

        if (isLogin) {
            body = { email, password };
        } else {
            const randomAvatar = EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)];

            body = {
                email,
                password,
                firstName,
                secondName,
                avatar: randomAvatar
            };
        }

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Помилка авторизації');
            }

            const token = data.token;
            if (!token) throw new Error('Сервер не повернув токен');

            const meResponse = await fetch(`${baseUrl}/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!meResponse.ok) throw new Error('Не вдалося завантажити профіль');

            const meData = await meResponse.json();

            login(token, meData);

            setSuccessName(meData.firstName);
            setIsSuccess(true);

            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setSuccessName('');
                setEmail('');
                setPassword('');
                setFirstName('');
                setSecondName('');
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {isSuccess ? (
                    <div className={styles.successContainer}>
                        <div className={styles.successIconCircle}>✓</div>
                        <h2 className={styles.title}>Успішно!</h2>
                        <p>Вітаємо, {successName}!</p>
                    </div>
                ) : (
                    <>
                        <button className={styles.closeButton} onClick={onClose}>&times;</button>

                        <h2 className={styles.title}>
                            {isLogin ? 'Вхід' : 'Реєстрація'}
                        </h2>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>

                            {!isLogin && (
                                <div className={styles.row}>
                                    <input
                                        type="text" placeholder="Ім'я" required
                                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                        className={styles.input}
                                    />
                                    <input
                                        type="text" placeholder="Прізвище" required
                                        value={secondName} onChange={(e) => setSecondName(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                            )}

                            <input
                                type="email" placeholder="Email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />

                            <input
                                type="password" placeholder="Пароль" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />

                            <button type="submit" className={styles.submitButton}>
                                {isLogin ? 'Увійти' : 'Зареєструватися'}
                            </button>
                        </form>

                        <div className={styles.footer}>
                            <span>{isLogin ? "Немає акаунту? " : "Вже є акаунт? "}</span>
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                className={styles.toggleButton}
                            >
                                {isLogin ? 'Створити' : 'Увійти'}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}