import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './PostPage.module.css';
import { IPost } from '../../data';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export function PostPage() {
    const { id } = useParams<{ id: string }>();
    const { token, isAuthenticated } = useAuth();
  
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [imgError, setImgError] = useState(false);

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8000/posts/${id}`, {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {}
                });
                
                if (!response.ok) throw new Error('Пост не знайдено');
                
                const data = await response.json();
                setPost(data);
                
                setLikes(data.likeCount || 0);
                setIsLiked(data.isLiked || false);
                
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, token]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert("Увійдіть, щоб оцінити! 🔒");
            return;
        }
        if (isLiking || !post) return;
        
        setIsLiking(true);
        try {
            const response = await fetch(`http://localhost:8000/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.dataLike) {
                    setLikes(responseData.dataLike.newLikeCount);
                    setIsLiked(responseData.dataLike.liked);
                }
            }
        } catch (error) {
            console.error("Like error", error);
        } finally {
            setIsLiking(false);
        }
    };

    if (loading) return <div className={styles.loadingContainer}><div className="spinner"></div></div>;

    if (error || !post) return (
        <div className={styles.errorContainer}>
            <div className={styles.errorBox}>
                <h2>😕 Пост не знайдено</h2>
                <Link to="/posts" className={styles.backButton}>Повернутися назад</Link>
            </div>
        </div>
    );

    const getTagName = (tagItem: any) => tagItem.tag?.name || tagItem.name || 'tag';

    return (
        <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Link to="/posts" className={styles.backButton}>← Назад</Link>
            </div>

            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    {post.pic && !imgError ? (
                        <img 
                            src={post.pic} 
                            alt={post.name} 
                            className={styles.image} 
                            onError={() => setImgError(true)} 
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            {post.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.headerCard}>
                        <h1 className={styles.title}>{post.name}</h1>
                        <div className={styles.tags}>
                            {post.tags?.map((tagItem, index) => (
                                <span key={index} className={styles.tagPill}>
                                    #{getTagName(tagItem)}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.meta}>
                        <div className={styles.author}>
                            <UserAvatar 
                                avatar={post.user?.avatar} 
                                className={styles.avatar} 
                            />
                            <span className={styles.authorName}>
                                {post.user?.firstName || 'Unknown'}
                            </span>
                        </div>
                        
                        <button 
                            className={`${styles.likes} ${isLiked ? styles.liked : ''}`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            {isLiked ? '❤️' : '🤍'} {likes}
                        </button>
                    </div>

                    <hr className={styles.divider}/>

                    <div className={styles.description}>
                        {post.description}
                    </div>
                </div>
            </div>
        </div>
    );
};