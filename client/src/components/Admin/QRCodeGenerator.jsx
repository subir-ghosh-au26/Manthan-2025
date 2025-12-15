import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, Copy, Award } from 'lucide-react'; // Changed icon to Award
import styles from '../DelegateForm/DelegateForm.module.css';

const QRCodeGenerator = () => {
  const qrRef = useRef(null);
  const [url, setUrl] = useState('');
  const qrCodeInstance = useRef(null);

  // --- 3D PHYSICS ENGINE ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // BIPARD COLORS
  const RED_PRIMARY = '#d32f2f';
  const BLUE_ACCENT = '#1565c0';
  const GOLD_TEXT = '#8d6e63'; 

  useEffect(() => {
    const currentUrl = window.location.origin;
    setUrl(currentUrl);

    // --- BIPARD THEMED CONFIGURATION ---
    qrCodeInstance.current = new QRCodeStyling({
      width: 1200, // Ultra HD for printing
      height: 1200,
      type: 'svg',
      data: currentUrl,
      image: '/logo.png',
      dotsOptions: {
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 135,
          colorStops: [
            { offset: 0, color: '#002D62' }, // Deep Red
            { offset: 0.6, color: '#002D62' }, // Bright Red
            { offset: 1, color: '#002D62' }  // Deep Blue tip
          ]
        }
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: '#002D62'
      },
      cornersDotOptions: {
        type: 'dot',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#002D62' },
            { offset: 1, color: '#002D62' }
          ]
        }
      },
      backgroundOptions: {
        color: 'transparent',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 1,
        imageSize: 0.45
      }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeInstance.current.append(qrRef.current);
    }
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseXPct = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseYPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseXPct);
    y.set(mouseYPct);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  const downloadQR = () => {
    qrCodeInstance.current.download({ name: "BIPARD_Feedback_QR", extension: "png" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Copied!");
  };

  return (
    <div style={{ perspective: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' }}>
      
      {/* --- THE MEDALLION CARD --- */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          // Ceramic / Marble white background to match the logo background
          background: 'linear-gradient(135deg, #fdfbf7 0%, #f3f4f6 100%)', 
          border: '4px solid #b71c1c', // Red Border like the logo ring
          borderRadius: '40px',
          padding: '40px',
          width: '400px',
          boxShadow: '0 30px 60px -10px rgba(0,0,0,0.4), 0 0 20px rgba(183, 28, 28, 0.2)', // Red glow
          position: 'relative',
          cursor: 'grab'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ cursor: 'grabbing' }}
      >
        
        {/* Glossy Overlay */}
        <motion.div 
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '35px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)',
            opacity: useTransform(mouseY, [-0.5, 0.5], [0.6, 0]),
            pointerEvents: 'none', zIndex: 10
          }}
        />

        {/* --- HEADER --- */}
        <div style={{ transform: 'translateZ(40px)', textAlign: 'center' }}>
          <h2 style={{ 
            color: '#b71c1c', // Deep Red
            fontFamily: '"Playfair Display", serif',
            fontSize: '2.2rem',
            margin: '0 0 5px 0',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            BIPARD
          </h2>
          <p style={{ 
            color: '#1565c0', // Royal Blue
            fontSize: '0.85rem', 
            fontWeight: '600',
            marginBottom: '20px', 
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Delegate Feedback Portal
          </p>
        </div>

        {/* --- QR CODE --- */}
        <div 
          style={{ 
            transform: 'translateZ(60px)',
            background: 'white',
            padding: '15px',
            borderRadius: '50%', // Circular container to match logo
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '2px solid #8d6e63', // Gold border
            width: '280px',
            height: '280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <div ref={qrRef} />
          {/* Force QR inside circle */}
          <style>{`canvas { width: 100% !important; height: auto !important; }`}</style>
        </div>

        {/* --- BOTTOM BADGE --- */}
        <div style={{ transform: 'translateZ(30px)', marginTop: '25px', textAlign: 'center' }}>
           <div style={{ 
             display: 'inline-flex', alignItems: 'center', gap: '8px', 
             color: '#fff', fontSize: '0.9rem', fontWeight: '600', 
             background: 'linear-gradient(90deg, #b71c1c 0%, #d32f2f 100%)', // Red Badge
             padding: '8px 16px', borderRadius: '20px',
             boxShadow: '0 4px 10px rgba(183, 28, 28, 0.3)'
           }}>
              <Award size={16} /> Official Scan
           </div>
        </div>

      </motion.div>

      {/* --- CONTROLS --- */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '400px' }}>
        <button 
          onClick={downloadQR}
          className={styles.button}
          style={{ 
            marginTop: 0, 
            background: 'linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)', // Blue Button
            color: 'white',
            boxShadow: '0 4px 15px rgba(21, 101, 192, 0.4)'
          }}
        >
          <Download size={20} /> Download HD
        </button>

        <button 
          onClick={copyLink}
          className={styles.button}
          style={{ marginTop: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <Copy size={20} /> Copy Link
        </button>
      </div>

    </div>
  );
};

export default QRCodeGenerator;