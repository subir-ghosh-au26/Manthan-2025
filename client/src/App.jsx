import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DelegateForm from './components/DelegateForm/DelegateForm';
import './index.css';

const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));

const LoadingFallback = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
    Loading Dashboard...
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0 }}>
        <Routes>
          {/* Public Route: The Feedback Form */}
          <Route path="/" element={<DelegateForm />} />
          
          {/* Private Route: The Admin Panel */}
          <Route 
            path="/admin" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;