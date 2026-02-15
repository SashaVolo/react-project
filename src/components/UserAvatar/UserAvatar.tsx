import React from 'react';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
    avatar?: string;
    className?: string;
    style?: React.CSSProperties; 
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, className, style }) => {
    return (
        <div 
            className={`${styles.avatarContainer} ${className || ''}`}
            style={style} 
        >
            <span className={styles.avatarEmoji}>
                {avatar || "👤"}
            </span>
        </div>
    );
};