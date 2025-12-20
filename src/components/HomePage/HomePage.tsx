import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

import styles from "./HomePage.module.css";


import iconLogo from '../../assets/logo.svg';
import logoMobile from '../../assets/logoMobile.svg'; 
import endLogo from '../../assets/endLogo.svg';
import rocket from '../../assets/rocket.svg';




const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 }
    },
    hover: {
        scale: 1.03,
        borderColor: "rgba(255, 255, 255, 0.5)",
        boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.4)",
        transition: { duration: 0.3 }
    }
};

const rocketVariants: Variants = {
    visible: { x: 0, y: 0 },
    hover: {
        x: 20,
        y: -20,
        rotate: 5,
        transition: { type: "spring", stiffness: 300 }
    }
};

export const HomePage = () => {

    const isMobile = useMediaQuery({ maxWidth: 1000 });

    return (
        <div className={styles.homePage}>


            <section className={styles.logoSection}>

                <img
                    src={isMobile ? logoMobile : iconLogo}
                    alt="Luppiter Logo"
                />
            </section>



            <section className={styles.descriptionSection}>
                <p>
                    <span>luppiter</span> — це веб-платформа, що дозволяє користувачам реєструватися,
                    створювати пости, переглядати записи інших людей та взаємодіяти з
                    контентом через вподобання.
                </p>
            </section>


            <section className={styles.structure}>
                <h2 className={styles.structureTitle}>Project structure</h2>


                <motion.article
                    className={styles.techCard}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                >
                    {!isMobile ? <motion.img
                        src={rocket}
                        alt='rocket'
                        className={styles.cardDecoration}
                        variants={rocketVariants}
                    /> : <></>}

                    <h3>Backend</h3>
                    <h4>Використані технології</h4>
                    <ul>
                        <li><strong>Node.js</strong> — серверне середовище виконання;</li>
                        <li><strong>Express.js</strong> — створення маршрутів та логіки API;</li>
                        <li><strong>Prisma ORM</strong> — робота з базою даних;</li>
                        <li><strong>SQLite</strong> — база даних;</li>
                        <li><strong>bcrypt </strong>— хешування паролів;</li>
                        <li><strong>jsonwebtoken (JWT)</strong> — авторизація користувачів;</li>
                        <li><strong>TypeScript</strong> — типізація та підвищення надійності коду.</li>
                    </ul>
                </motion.article>


                <motion.article
                    className={styles.techCard}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                >
                    {!isMobile ? <motion.img
                        src={rocket}
                        alt='rocket'
                        className={styles.cardDecoration}
                        variants={rocketVariants}
                    /> : <></>}
                    <h3>Frontend</h3>
                    <h4>Використані технології</h4>
                    <ul>
                        <li>
                            <strong>React</strong> — бібліотека для створення інтерактивних інтерфейсів.
                        </li>
                        <li>
                            <strong>TypeScript</strong> — надбудова над JavaScript зі статичною типізацією.
                        </li>
                        <li>
                            <strong>React Router DOM</strong> — бібліотека маршрутизації для SPA (Single Page Application). Забезпечує миттєву навігацію між сторінками без перезавантаження браузера.
                        </li>
                        <li>
                            <strong>CSS3</strong> — використання сучасних можливостей стилізації (Flexbox, Grid) та медіа-запитів для створення повністю адаптивного дизайну під мобільні та десктопні пристрої.
                        </li>
                        <li>
                            <strong>HTML5</strong> — забезпечує правильну структуру документа та покращує доступність.
                        </li>
                        <li>
                            <strong>Framer Motion</strong> — бібліотека для створення декларативних анімацій. Забезпечує плавні переходи між сторінками, анімацію появи елементів та реакцію на жести користувача.
                        </li>
                    </ul>
                </motion.article>


                <motion.article
                    className={styles.techCard}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                >
                    {!isMobile ? <motion.img
                        src={rocket}
                        alt='rocket'
                        className={styles.cardDecoration}
                        variants={rocketVariants}
                    /> : <></>}
                    <h3>Database structure</h3>
                    <ol>
                        <li>
                            <strong>User</strong>
                            <p>Зберігає інформацію про користувачів.</p>
                            <ul><li>id, firstName, secondName, email, password...</li></ul>
                        </li>
                        <li>
                            <strong>Post</strong>
                            <p>Зберігає дані про пости.</p>
                            <ul><li>id, name, description, pic, likeCount...</li></ul>
                        </li>
                        <li>
                            <strong>Tag / PostTag</strong>
                            <p>Система тегів для категоризації постів.</p>
                        </li>
                    </ol>
                </motion.article>
            </section>

            <section className={styles.endLogoSection}>
                <img src={endLogo} alt='endlogo' />
            </section>
        </div>
    );
};