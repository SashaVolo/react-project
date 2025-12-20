import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom'; 
import styles from "./Header.module.css";


import userImg from "./../../assets/userIcon.svg";
import iconPosts from "./../../assets/iconPosts.svg";
import iconCreatePost from "./../../assets/iconCreatePost.svg";
import iconLanguage from "./../../assets/iconLanguage.svg";
import logoHeader from "./../../assets/logoHeader.svg";
import menuIcon from "./../../assets/menu.svg"; 
import videoMp4 from "./../../assets/video.mp4";

export function Header() {
    const isMobile = useMediaQuery({ maxWidth: 1000 });
    const [menuOpen, setMenuOpen] = useState(false);

    return (
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
                            <MenuItem text="Create" icon={iconCreatePost} path="/create" /> 
                            <MenuItem text="Language" icon={iconLanguage} path="#" />
                        </ul>
                    </nav>

                    <div className={styles.profile}>
                        <span>Profile</span>
                        <motion.img
                            src={userImg}
                            alt="Avatar"
                            whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
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
                                    autoPlay loop muted playsInline
                                />
                            </div>

                            <div className={styles.linksContainer}>
                                <div className={styles.mobileLinkItem}>
                                    <span>Profile</span>
                                    <img src={userImg} alt="Profile" className={styles.profileImg}/>
                                </div>

                                <div className={styles.separator}></div>

                                <Link 
                                    to="/posts" 
                                    className={styles.mobileLinkItem} 
                                    onClick={() => setMenuOpen(false)} 
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <span>Posts</span>
                                    <img src={iconPosts} alt="Posts" />
                                </Link>
                                
                                <div className={styles.mobileLinkItem}>
                                    <span>Create</span>
                                    <img src={iconCreatePost} alt="Create" />
                                </div>

                                <div className={styles.mobileLinkItem}>
                                    <span>Language</span>
                                    <img src={iconLanguage} alt="Lang" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.header>
    );
}


interface MenuItemProps {
    text: string;
    icon: string;
    path: string;
}

const MenuItem = ({ text, icon, path }: MenuItemProps) => (
    <motion.li
        whileHover={{ scale: 1.1, color: "#832F81" }}
        whileTap={{ scale: 0.95 }}
    >

        <Link to={path} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <span>{text}</span>
            <img src={icon} alt={text} />
        </Link>
    </motion.li>
);