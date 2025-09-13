import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:8000/api/auth';

// Helper function to check if JWT token is expired locally
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't parse the token, consider it expired
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    
    if (savedUser && savedToken) {
      // First check if token is expired locally
      if (isTokenExpired(savedToken)) {
        // Token is expired, clear storage
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoading(false);
        return;
      }
      
      // Token is not expired locally, set user immediately for better UX
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
      
      // Then verify with server in background
      verifyToken().then((isValid) => {
        if (!isValid) {
          // Server says token is invalid, clear storage
          console.warn('Server token verification failed, clearing user data');
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        } else {
          console.log('Server token verification successful');
        }
      }).catch((error) => {
        // Network error - keep user logged in if token is not expired locally
        console.warn('Token verification failed due to network error:', error);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found for verification');
        return false;
      }

      console.log('Verifying token with server...');
      const response = await fetch(`${API_BASE_URL}/verify/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Token verification response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token verification response data:', data);
        
        if (data.valid && data.user) {
          // Update user data from the response
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        } else {
          console.warn('Token verification returned invalid or missing user data');
        }
      } else {
        const errorData = await response.text();
        console.error('Token verification failed with status:', response.status, 'Error:', errorData);
      }
      return false;
    } catch (error) {
      console.error('Token verification network error:', error);
      // Don't return false immediately on network errors
      // Let the calling code decide what to do
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirm_password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
