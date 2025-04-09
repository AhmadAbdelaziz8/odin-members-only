import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await api.get('/api/users/me');
      setUser(data);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/users/login', { email, password });
      setUser(data);
      toast.success('Logged in successfully');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.post('/api/users/register', userData);
      toast.success('Registration successful! Please log in.');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/users/logout', {});
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw error;
    }
  };

  const updateMembership = async (userId, membershipStatus) => {
    try {
      const data = await api.patch(
        `/api/users/membership/${userId}`,
        { membershipStatus }
      );
      if (user?.id === userId) {
        setUser(data);
      }
      toast.success('Membership status updated successfully');
      return data;
    } catch (error) {
      console.error('Update membership error:', error);
      toast.error(error.response?.data?.message || 'Failed to update membership status');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateMembership
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}