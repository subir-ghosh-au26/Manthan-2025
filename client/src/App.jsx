import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DelegateForm from './components/DelegateForm/DelegateForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0 }}>
        <Routes>
          {/* Public Route: The Feedback Form */}
          <Route path="/" element={<DelegateForm />} />
          
          {/* Private Route: The Admin Panel */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;