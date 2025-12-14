import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import styles from './DelegateForm.module.css';

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  const labels = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Excellent",
    5: "Exceptional"
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Star
              size={32}
              fill={star <= (hover || value) ? '#fbbf24' : 'transparent'} // Gold fill
              color={star <= (hover || value) ? '#fbbf24' : '#94a3b8'}    // Gold/Grey stroke
              strokeWidth={star <= (hover || value) ? 0 : 1.5}
            />
          </motion.button>
        ))}
      </div>
      <div className={styles.ratingLabel}>
        {labels[hover || value] || ""}
      </div>
    </div>
  );
};

export default StarRating;