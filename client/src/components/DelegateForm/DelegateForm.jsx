import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Coffee, Bed, Users, MapPin, Calendar, Facebook, Linkedin, Instagram, Globe } from 'lucide-react';
import styles from './DelegateForm.module.css';
import StarRating from './StarRating';
import FeedbackSection from './FeedbackSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DelegateForm = () => {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    food: 0, stay: 0, conference: 0, campus: 0, activities: 0, comments: ''
  });

  const XIcon = ({ size = 24, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

  // --- CONFIGURATION: EDIT YOUR LINKS HERE ---
  const socialLinks = [
    { 
      id: 'website', 
      icon: Globe, 
      url: 'https://bipard.bihar.gov.in/', 
      color: '#2563eb' // Blue
    },
    { 
      id: 'linkedin', 
      icon: Linkedin, 
      url: 'https://www.linkedin.com/company/bipard-bihar-institute-of-public-administration-rural-development-bipard-gaya/?viewAsMember=true', 
      color: '#0a66c2' // LinkedIn Blue
    },
    { 
      id: 'twitter', 
      icon: XIcon, 
      url: 'https://x.com/BipardGaya', 
      color: '#000000' // X Black
    },
    { 
      id: 'facebook', 
      icon: Facebook, 
      url: 'https://www.facebook.com/bipard/', 
      color: '#1877f2' // FB Blue
    },
    { 
      id: 'instagram', 
      icon: Instagram, 
      url: 'https://www.instagram.com/bipard_gaya_jee?igsh=MWJiN3B0eGJpNXdicA==', 
      color: '#e1306c' // Insta Pink
    }
  ];
  // -------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.food === 0 || formData.stay === 0) {
      alert("Please provide ratings before submitting.");
      return;
    }
    
    setStatus('submitting');

    try {
      await axios.post(`${API_URL}/api/feedback`, formData);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  // --- SUCCESS VIEW WITH SOCIAL MEDIA ---
  if (status === 'success') {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            {/* Success Icon */}
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 150 }}
            >
              <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 24px' }} />
            </motion.div>
            
            <h2 className={styles.title} style={{ color: '#0f172a', fontSize: '2.5rem' }}>Thank You</h2>
            <p className={styles.subtitle} style={{ color: '#64748b' }}>
              Your feedback is invaluable. We hope you had a memorable stay.
            </p>

            {/* Social Media Section */}
            <motion.div 
              className={styles.socialSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className={styles.socialTitle}>Stay Connected</p>
              
              <div className={styles.socialGrid}>
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconWrapper}
                    whileHover={{ 
                      scale: 1.15, 
                      backgroundColor: link.color, 
                      color: '#ffffff',
                      y: -3
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon size={24} strokeWidth={2} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div className={styles.card} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Conference Feedback - Manthan 2025</h1>
          <p className={styles.subtitle}>Esteemed Delegate, we thank you for your gracious presence. Your feedback will assist the Institute in further strengthening the planning and conduct of future programmes. We kindly request you to spare a few moments to share your observations.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formBody}>
            <FeedbackSection icon={Users} title="BIPARD Conference" delay={0.3}>
            <StarRating value={formData.conference} onChange={(v) => setFormData({...formData, conference: v})} />
          </FeedbackSection>
          <FeedbackSection icon={Bed} title="Accommodation" delay={0.2}>
            <StarRating value={formData.stay} onChange={(v) => setFormData({...formData, stay: v})} />
          </FeedbackSection>
          <FeedbackSection icon={Coffee} title="Dining & Refreshments" delay={0.1}>
            <StarRating value={formData.food} onChange={(v) => setFormData({...formData, food: v})} />
          </FeedbackSection>       
          <FeedbackSection icon={MapPin} title="Campus Environment" delay={0.4}>
            <StarRating value={formData.campus} onChange={(v) => setFormData({...formData, campus: v})} />
          </FeedbackSection>
          <FeedbackSection icon={Calendar} title="Activities" delay={0.5}>
            <StarRating value={formData.activities} onChange={(v) => setFormData({...formData, activities: v})} />
          </FeedbackSection>

          <motion.div style={{ marginTop: '30px' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <label className={styles.label}>Additional Remarks</label>
            <textarea
              className={styles.textArea}
              placeholder="Any suggestions..."
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
            />
          </motion.div>

          <motion.button
            className={styles.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === 'submitting'}
          >
           {status === 'submitting' ? 'Processing...' : (
              <>Submit Feedback <Send size={20} /></>
            )}
          </motion.button>
          {status === 'error' && (
            <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '15px' }}>
              Connection Error. Please try again.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default DelegateForm;