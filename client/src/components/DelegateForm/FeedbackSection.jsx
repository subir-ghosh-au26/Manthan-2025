import React from 'react';
import { motion } from 'framer-motion';
import styles from './DelegateForm.module.css';

const FeedbackSection = ({ icon: Icon, title, children, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ marginBottom: '32px' }}
    >
      <div className={styles.label}>
        <span className={styles.iconWrapper}><Icon size={24} /></span>
        {title}
      </div>
      {children}
    </motion.div>
  );
};

export default FeedbackSection;