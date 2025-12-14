import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Copy } from 'lucide-react';
import styles from '../DelegateForm/DelegateForm.module.css';

const QRCodeGenerator = () => {
  const qrRef = useRef();
  
    const FORM_URL = window.location.origin; 

  // 2. DOWNLOAD FUNCTION
  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = 'Delegate_Feedback_QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. COPY LINK FUNCTION
  const copyLink = () => {
    navigator.clipboard.writeText(FORM_URL);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '500px',
      margin: '0 auto',
      textAlign: 'center',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ 
        color: '#1e3a8a', 
        fontFamily: '"Playfair Display", serif',
        fontSize: '1.8rem',
        marginBottom: '10px'
      }}>
        Scan to Review
      </h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        Place this QR code on tables or banners.
      </p>

      {/* --- THE QR CODE --- */}
      <div 
        ref={qrRef}
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          display: 'inline-block',
          marginBottom: '30px',
          border: '1px solid #e2e8f0'
        }}
      >
        <QRCodeCanvas
          value={FORM_URL}
          size={250}
          bgColor={"#ffffff"}
          fgColor={"#1e3a8a"} // Royal Blue Color
          level={"H"} // High Error Correction (allows for logo)
          includeMargin={true}
          imageSettings={{
            // You can replace this src with your actual organization logo URL
            src: "/logo.png", 
            x: undefined,
            y: undefined,
            height: 50,
            width: 50,
            excavate: true, // Cuts a hole in the QR for the logo
          }}
        />
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <button 
          onClick={downloadQR}
          className={styles.button}
          style={{ marginTop: 0, padding: '15px', background: '#1e3a8a' }}
        >
          <Download size={18} /> Download PNG
        </button>

        <button 
          onClick={copyLink}
          className={styles.button}
          style={{ marginTop: 0, padding: '15px', background: '#64748b' }}
        >
          <Copy size={18} /> Copy URL
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8', wordBreak: 'break-all' }}>
        {FORM_URL}
      </div>
    </div>
  );
};

export default QRCodeGenerator;