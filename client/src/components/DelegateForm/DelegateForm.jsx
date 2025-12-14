import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Coffee, Bed, Users, MapPin, Calendar, Facebook, Linkedin, Instagram, Globe } from 'lucide-react';
import StarRating from './StarRating';
import FeedbackSection from './FeedbackSection';
import styles from './DelegateForm.module.css';

// Custom X Logo
const XLogo = ({ size = 24, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const DelegateForm = () => {
  const [status, setStatus] = useState('idle'); 
  const [formData, setFormData] = useState({
    food: 0, stay: 0, conference: 0, campus: 0, activities: 0, comments: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const STORAGE_KEY = 'pending_feedback_queue';

  // --- HELPER: SAFE STORAGE ACCESS ---
  // These functions prevent the app from crashing in Incognito mode
  const getSafeQueue = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.warn("Storage access denied (Incognito mode). Offline features disabled.");
      return null; // Return null to indicate storage is blocked
    }
  };

  const setSafeQueue = (queue) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      return true;
    } catch (e) {
      return false;
    }
  };

  // --- 1. QUEUE PROCESSING LOGIC ---
  const processQueue = async () => {
    const queue = getSafeQueue();
    if (!queue || queue.length === 0) return;

    console.log(`📡 Attempting to sync ${queue.length} pending items...`);
    const newQueue = [];

    for (const item of queue) {
      try {
        await axios.post(`${API_URL}/api/feedback`, item);
        console.log("✅ Background sync successful for item:", item.id);
      } catch (error) {
        console.error("❌ Sync failed, keeping in queue:", error);
        newQueue.push(item);
      }
    }

    setSafeQueue(newQueue);
  };

  // --- 2. RETRY ON LOAD ---
  useEffect(() => {
    processQueue();
    const handleOnline = () => processQueue();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // --- 3. ROBUST SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { food, stay, conference, campus } = formData;
    if (!food || !stay || !conference || !campus) {
      alert("Please provide a rating for all main categories.");
      return;
    }

    const payload = { ...formData, id: Date.now() };

    // TRY TO SAVE TO LOCAL STORAGE (Offline Mode)
    const currentQueue = getSafeQueue();

    if (currentQueue !== null) {
      // SCENARIO A: Normal Browser (Storage Available)
      const updatedQueue = [...currentQueue, payload];
      setSafeQueue(updatedQueue);
      
      // Optimistic Success
      setStatus('success');
      
      // Sync in background
      processQueue();
    } else {
      // SCENARIO B: Incognito Mode (Storage Blocked)
      // We cannot save to queue, so we MUST send immediately and wait.
      setStatus('submitting');
      try {
        await axios.post(`${API_URL}/api/feedback`, payload);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error'); // We must show error here because we couldn't save it
      }
    }
  };

  const socialLinks = [
    { id: 'website', icon: Globe, url: 'https://bipard.bihar.gov.in/', color: '#2563eb' },
    { id: 'linkedin', icon: Linkedin, url: 'https://www.linkedin.com/company/bipard-bihar-institute-of-public-administration-rural-development-bipard-gaya/?viewAsMember=true', color: '#0a66c2' },
    { id: 'x', icon: XLogo, url: 'https://x.com/BipardGaya', color: '#000000' },
    { id: 'facebook', icon: Facebook, url: 'https://www.facebook.com/bipard/', color: '#1877f2' },
    { id: 'instagram', icon: Instagram, url: 'https://www.instagram.com/bipard_gaya_jee?igsh=MWJiN3B0eGJpNXdicA==', color: '#e1306c' }
  ];

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 150 }}>
              <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 24px' }} />
            </motion.div>
            <h2 className={styles.title} style={{ color: '#0f172a', fontSize: '2.5rem' }}>Thank You</h2>
            <p className={styles.subtitle} style={{ color: '#64748b' }}>Your feedback has been received.</p>
            
            <motion.div className={styles.socialSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <p className={styles.socialTitle}>Stay Connected</p>
              <div className={styles.socialGrid}>
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconWrapper}
                    whileHover={{ scale: 1.15, backgroundColor: link.color, color: '#ffffff', y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon size={22} strokeWidth={2} />
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
      <motion.div className={styles.card} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className={styles.header}>
          <h1 className={styles.title}>Conference Feedback - Manthan 2025</h1>
          <p className={styles.subtitle}>Esteemed Delegate, we thank you for your gracious presence. Your feedback will assist the Institute in further strengthening the planning and conduct of future programmes. We kindly request you to spare a few moments to share your observations.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formBody}>
          <FeedbackSection icon={Users} title="Conference Sessions" delay={0.1}>
            <StarRating value={formData.conference} onChange={(v) => setFormData({ ...formData, conference: v })} />
          </FeedbackSection>


          <FeedbackSection icon={Coffee} title="Dining & Refreshments" delay={0.2}>
            <StarRating value={formData.food} onChange={(v) => setFormData({ ...formData, food: v })} />
          </FeedbackSection>

          <FeedbackSection icon={Bed} title="Accommodation & Comfort" delay={0.3}>
            <StarRating value={formData.stay} onChange={(v) => setFormData({ ...formData, stay: v })} />
          </FeedbackSection>

          <FeedbackSection icon={MapPin} title="Campus Environment" delay={0.4}>
            <StarRating value={formData.campus} onChange={(v) => setFormData({ ...formData, campus: v })} />
          </FeedbackSection>

          <FeedbackSection icon={Calendar} title="Other Activities" delay={0.5}>
            <StarRating value={formData.activities} onChange={(v) => setFormData({ ...formData, activities: v })} />
          </FeedbackSection>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '40px' }}>
            <label className={styles.label}>Additional Remarks (Optional)</label>
            <textarea 
              className={styles.textArea}
              placeholder="Share your suggestions or compliments..."
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            />
          </motion.div>

          <motion.button 
            className={styles.button}
            whileHover={{ scale: 1.01, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : <>Submit Feedback <Send size={20} /></>}
          </motion.button>
          
          {status === 'error' && (
             <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '15px' }}>
               Unable to connect. Please try again.
             </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default DelegateForm;