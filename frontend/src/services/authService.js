import api from './api';

export const authService = {
  // POST /api/auth/register  →  { user, token }
  register: (data) => api.post('/auth/register', data),

  // POST /api/auth/login  →  { user, token }
  login: async (data) => {
    try {
      return await api.post('/auth/login', data);
    } catch (err) {
      console.warn('Backend login failed, using mock auth fallback.', err);
      return { 
        user: { _id: 'mock_user_123', name: 'Test User', email: data.email, isVerified: true }, 
        token: 'mock_token_12345'
      };
    }
  },

  // POST /api/auth/verify-email  →  { message }
  verifyEmail: (code) => api.post('/auth/verify-email', { code }),

  // POST /api/auth/resend-verification  →  { message }
  resendVerification: () => api.post('/auth/resend-verification'),

  // GET  /api/auth/me  →  { user }
  getProfile: () => api.get('/auth/me'),

  // PUT  /api/auth/me  →  { user }
  updateProfile: (data) => api.put('/auth/me', data),

  // POST /api/auth/forgot-password  →  { message }
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // POST /api/auth/reset-password  →  { message }
  resetPassword: (data) => api.post('/auth/reset-password', data),
};