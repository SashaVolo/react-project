import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IPost } from '../../data';
import styles from './ProfilePage.module.css';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { PostCard } from '../PostCard/PostCard';
const EMOJI_AVATARS = [
    // Тварини
    "🦁", "🦊", "🐱", "🐶", "🦄", "🐸", "🐼", "🐨", "🐯", "🐷", "🐵", "🐙", "🦑", "🐝", "🐞", "🦋", "🐠", "🐡", "🐢", "🐍", "🦎", "🦕", "🦖", "🐓", "🦃", "🦚", "🦜", "🦈", "🐬", "🐋", "🐊",
    
    // Фантастика та Герої
    "👾", "🤖", "👻", "👽", "💩", "🤡", "👹", "👺", "💀", "☠️", "🎃", "🤠", "🧠", "👀", "🐼", "🐲"
    
    
    
];
export function ProfilePage() {
    const { user, isAuthenticated, token, updateUserData } = useAuth();
    const [myPosts, setMyPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);


    const [currentAvatar, setCurrentAvatar] = useState(user?.avatar || "👤");

    useEffect(() => {
        if (user?.avatar) {
            setCurrentAvatar(user.avatar);
        }
    }, [user?.id]);

    const fetchMyPosts = useCallback(async () => {
        if (!user || !token) return;
        try {
            const response = await fetch('http://localhost:8000/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const allPosts: IPost[] = await response.json();
                const userPosts = allPosts.filter(p => p.user.id === user.id);
                setMyPosts(userPosts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, token]);

    useEffect(() => {
        fetchMyPosts();
    }, [fetchMyPosts]);

    const handleEmojiClick = async (emoji: string) => {
        const previousAvatar = currentAvatar;
        setCurrentAvatar(emoji);

        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/users/me/avatar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar: emoji })
            });

            if (response.ok) {
                updateUserData({ avatar: emoji });
            } else {
                throw new Error("Failed to update avatar");
            }
        } catch (error) {
            console.error("Avatar update error:", error);

            setCurrentAvatar(previousAvatar);
            alert("Не вдалося змінити аватар. Спробуйте ще раз! 😕");
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className={styles.centeredMessage}>
                <h2>🔒 Будь ласка, увійдіть у систему</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.centeredMessage}>
                <div className="spinner"></div>
            </div>
        );
    }

    const totalLikes = myPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.banner}></div>

                <div className={styles.userInfo}>
                    <div className={styles.avatarWrapper}>
                        <UserAvatar
                            avatar={currentAvatar}
                            className={styles.avatar}
                            style={{ '--size': '180px' } as React.CSSProperties}
                        />
                    </div>

                    <div className={styles.details}>
                        <h1 className={styles.name}>{user.firstName} {user.secondName}</h1>

                        <div className={styles.emojiPickerContainer}>
                            <p className={styles.emojiPickerLabel}>Оберіть новий аватар:</p>
                            <div className={styles.emojiGrid}>
                                {EMOJI_AVATARS.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className={`${styles.emojiButton} ${currentAvatar === emoji ? styles.active : ''}`}
                                        aria-label={`Вибрати ${emoji}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{myPosts.length}</span>
                                <span className={styles.statLabel}>Пости</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{totalLikes}</span>
                                <span className={styles.statLabel}>Лайки</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.postsSection}>
                <h2>My Posts</h2>
                {myPosts.length > 0 ? (
                    <div className={styles.postsGrid}>
                        {myPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3>У вас поки немає публікацій 😔</h3>
                        <p>Час створити щось круте!</p>
                    </div>
                )}
            </div>
        </div>
    );
}