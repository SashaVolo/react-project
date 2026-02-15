import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';
import { IPost } from '../../data'; 
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../UserAvatar/UserAvatar';


interface PostCardProps {
    post: IPost;
}

export function PostCard({ post }: PostCardProps) {
    const { token, isAuthenticated } = useAuth();


    const [imgError, setImgError] = useState(false);

    const [likes, setLikes] = useState(post.likeCount);
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        setLikes(post.likeCount);
        setIsLiked(post.isLiked);
    }, [post.likeCount, post.isLiked]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); 

        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть, щоб оцінити пост! 🔒");
            return;
        }

        if (isLiking) return;
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
            console.error("Мережева помилка", error);
        } finally {
            setIsLiking(false);
        }
    };

    const getTagName = (tagItem: any) => tagItem.tag?.name || tagItem.name || 'tag';

    return (
        <Link to={`/posts/${post.id}`} className={styles.card}>


            <div className={styles.imageWrapper}>
                {!imgError ? (
                    <img
                        src={post.pic}
                        alt={post.name}
                        className={styles.image}
                        onError={() => setImgError(true)} 
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.gradientFallback}>
                        <span>🖼️</span>
                    </div>
                )}

                <div className={styles.overlay}></div>


                <div className={styles.tags}>
                    {post.tags?.slice(0, 3).map((tagItem, index) => (
                        <span key={index} className={styles.tag}>
                            #{getTagName(tagItem)}
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title} title={post.name}>{post.name}</h3>

                <p className={styles.description}>
                    {post.description.length > 100
                        ? post.description.slice(0, 100) + '...'
                        : post.description}
                </p>

                <div className={styles.footer}>
                    <div className={styles.author}>
                        <UserAvatar
                            avatar={post.user?.avatar}
                            style={{ '--size': '32px' } as React.CSSProperties}
                        />
                        <span className={styles.authorName}>
                            {post.user?.firstName || 'Unknown'}
                        </span>
                    </div>

                    <button
                        className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
                        onClick={handleLike}
                        disabled={isLiking}
                    >
                        <span className={styles.heartIcon}>{isLiked ? '❤️' : '🤍'}</span>
                        <span className={styles.likeCount}>{likes}</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}