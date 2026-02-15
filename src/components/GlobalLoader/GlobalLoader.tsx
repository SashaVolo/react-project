import React from 'react';
import styles from './GlobalLoader.module.css';
import { motion } from 'framer-motion';

export const GlobalLoader = () => {
    return (
        <motion.div 
            className={styles.loaderContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.spinner}>
                <div className={styles.blob}></div>
                <div className={styles.blob}></div>
            </div>
        </motion.div>
    );
};