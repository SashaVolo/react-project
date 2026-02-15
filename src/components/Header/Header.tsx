import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

import userImg from "./../../assets/userIcon.svg";
import iconPosts from "./../../assets/iconPosts.svg";
import iconCreatePost from "./../../assets/iconCreatePost.svg";
import iconTheme from "./../../assets/iconLanguage.svg";
import logoHeader from "./../../assets/logoHeader.svg";
import menuIcon from "./../../assets/menu.svg";
import videoMp4 from "./../../assets/video.mp4";
import exitIcon from "./../../assets/exit.png";

import { useAuth } from '../../context/AuthContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { AuthModal } from '../AuthModal/AuthModal';
import { CreatePostModal } from '../CreatePostModal/CreatePostModal';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export function Header() {
    const isMobile = useMediaQuery({ maxWidth: 1000 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();
    const { currentTheme, setTheme } = useTheme();
    const navigate = useNavigate();

    const handleCreateClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setModalOpen(true);
        } else {
            setCreateModalOpen(true);
        }
    };

    return (
        <>
            <motion.header
                className={styles.header}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            >
                <div className={styles.topBar}>
                    <div className={styles.logoHeader}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
                            <motion.img
                                src={logoHeader}
                                alt='logo'
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                            />
                            <motion.span whileHover={{ scale: 1.05 }}>
                                luppiter
                            </motion.span>
                        </Link>
                    </div>

                    {!isMobile && (
                        <>
                            <nav>
                                <ul className={styles.navList}>
                                    <MenuItem text="Posts" icon={iconPosts} path="/posts" />

                                    <li onClick={handleCreateClick} style={{ cursor: 'pointer' }}>
                                        <MenuItem text="Create" icon={iconCreatePost} path="#" />
                                    </li>

                                    <li
                                        className={styles.themeContainer}
                                        onMouseEnter={() => setIsThemeMenuOpen(true)}
                                        onMouseLeave={() => setIsThemeMenuOpen(false)}
                                    >
                                        <div className={styles.menuItemContent}>
                                            <span>Themes</span>
                                            <img src={iconTheme} alt="Themes" />
                                        </div>
                                        <AnimatePresence>
                                            {isThemeMenuOpen && (
                                                <motion.div
                                                    className={styles.themeDropdown}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {THEMES.map(theme => (
                                                        <div
                                                            key={theme.id}
                                                            className={`${styles.themeOption} ${currentTheme === theme.id ? styles.activeTheme : ''}`}
                                                            onClick={() => setTheme(theme.id)}
                                                        >
                                                            <div
                                                                className={styles.themePreview}
                                                                style={{ background: theme.background }}
                                                            />
                                                            <span>{theme.name}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                </ul>
                            </nav>

                            <div className={styles.authContainer}>
                                {isAuthenticated ? (
                                    <div className={styles.profileMenu}>
                                        <div className={styles.profile} onClick={() => navigate('/profile')}>
                                            <span>{user?.firstName}</span>
                                            <UserAvatar
                                                avatar={user?.avatar}
                                                className={styles.avatar}
                                                style={{ '--size': '45px' } as React.CSSProperties}
                                            />
                                        </div>
                                        <motion.button
                                            onClick={logout}
                                            className={styles.iconButton}
                                            whileHover={{ scale: 1.2, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Вийти"
                                        >
                                            <img src={exitIcon} alt="Exit" className={styles.exitIcon} />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className={styles.profile} onClick={() => setModalOpen(true)}>
                                        <span>Login</span>
                                        <motion.img
                                            src={userImg}
                                            alt="Login"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {isMobile && (
                        <div
                            className={styles.burgerBtn}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <img
                                src={menuIcon}
                                alt="menu"
                                style={{ transform: menuOpen ? "rotate(90deg)" : "none", transition: "0.3s" }}
                            />
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isMobile && menuOpen && (
                        <motion.div
                            className={styles.expandedContent}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <div className={styles.expandedGrid}>
                                <div className={styles.videoContainer}>
                                    <video 
                                        src={videoMp4} 
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline 
                                        className={styles.menuVideo} 
                                    />
                                </div>

                                <div className={styles.linksContainer}>
                                    <div className={styles.mobileLinkItem} onClick={() => {
                                        if (!isAuthenticated) setModalOpen(true);
                                        else navigate('/profile');
                                        setMenuOpen(false);
                                    }}>
                                        <span>{isAuthenticated ? user?.firstName : "Login"}</span>
                                        {isAuthenticated ? (
                                            <UserAvatar
                                                avatar={user?.avatar}
                                                style={{ '--size': '35px' } as React.CSSProperties}
                                            />
                                        ) : (
                                            <img src={userImg} alt="Profile" className={styles.profileImg} />
                                        )}
                                    </div>

                                    <div className={styles.separator}></div>

                                    <Link to="/posts" className={styles.mobileLinkItem} onClick={() => setMenuOpen(false)}>
                                        <span>Posts</span>
                                        <img src={iconPosts} alt="Posts" />
                                    </Link>

                                    <div className={styles.mobileLinkItem} onClick={() => {
                                        if (!isAuthenticated) setModalOpen(true);
                                        else setCreateModalOpen(true);
                                        setMenuOpen(false);
                                    }}>
                                        <span>Create</span>
                                        <img src={iconCreatePost} alt="Create" />
                                    </div>

                                    <div className={styles.mobileThemeSection}>
                                        <p className={styles.mobileSectionTitle}>Theme 🎨</p>
                                        <div className={styles.mobileThemesGrid}>
                                            {THEMES.map(theme => (
                                                <div
                                                    key={theme.id}
                                                    className={`${styles.mobileThemeItem} ${currentTheme === theme.id ? styles.activeMobileTheme : ''}`}
                                                    onClick={() => setTheme(theme.id)}
                                                >
                                                    <div className={styles.themePreviewSmall} style={{ background: theme.background }}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {isAuthenticated && (
                                        <div className={styles.mobileLinkItem} onClick={() => {
                                            logout();
                                            setMenuOpen(false);
                                        }} style={{ color: 'red' }}>
                                            <span>Logout</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={() => window.location.reload()} />
        </>
    );
}

interface MenuItemProps {
    text: string;
    icon: string;
    path: string;
}

const MenuItem = ({ text, icon, path }: MenuItemProps) => (
    <motion.li whileHover={{ scale: 1.1, color: "#832F81" }} whileTap={{ scale: 0.95 }}>
        <Link to={path} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <span>{text}</span>
            <img src={icon} alt={text} />
        </Link>
    </motion.li>
);