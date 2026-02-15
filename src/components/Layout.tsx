import React from 'react';
import { useLocation, useOutlet, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header/Header';
import { Main } from './Main/Main';
import { Footer } from './Footer/Footer';



export const Layout: React.FC = () => {
  const location = useLocation();


  const element = useOutlet();

  return (
    <div className="app-container">
      <Header />

      <Main>

        <AnimatePresence mode="wait" initial={false}>

          <motion.div

            key={location.pathname}


            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}

            style={{ width: '100%' }}
          >

            {element}

          </motion.div>

        </AnimatePresence>
      </Main>

      <Footer />
    </div>
  );
};