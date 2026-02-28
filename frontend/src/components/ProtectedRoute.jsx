import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://melo-logo-studio.onrender.com/api/payment/check-status/${user.email}`
        );

        const data = await res.json();

        if (data.success && data.isPremium) {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Premium check failed", error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isPremium ? <Outlet /> : <Navigate to="/payment" />;
};

export default ProtectedRoute;