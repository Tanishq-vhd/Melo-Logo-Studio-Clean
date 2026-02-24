import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        // This calls the /api/profile route we discussed earlier
        const token = localStorage.getItem("token");
        const response = await axios.get("https://melo-logo-studio.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Use the status from your MongoDB
        setIsPremium(response.data.isPremium);
      } catch (error) {
        console.error("Auth check failed", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If premium, show the page (Outlet); if not, send to payment
  return isPremium ? <Outlet /> : <Navigate to="/payment" />;
};

export default ProtectedRoute;