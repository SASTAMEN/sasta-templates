import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ComponentShowcase from './pages/ComponentShowcase';
import ComponentDetail from './pages/ComponentDetail';
import PlaygroundPage from './pages/PlaygroundPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegister';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/components" element={<ComponentShowcase />} />
              <Route path="/components/category/:category" element={<ComponentShowcase />} />
              <Route path="/components/:id" element={<ComponentDetail />} />
              
              {/* Hidden Admin Routes */}
              <Route path="/create/admin" element={<AdminRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
