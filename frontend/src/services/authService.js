import api from './api';

export const authService = {
  // POST /api/v1/user/register  →  { message }
  register: (data) => api.post('/user/register', data),

  // POST /api/v1/user/login  →  { user, token }
  login: (data) => api.post('/user/login', data),

  // POST /api/v1/user/verify (with Authorization: Bearer <token>)
  verifyEmail: (token) => api.post('/user/verify', null, token),

  // POST /api/v1/user/resend-verification
  resendVerification: (email) => api.post('/user/resend-verification', { email }),

  // POST /api/v1/user/forgot-password
  forgotPassword: (email) => api.post('/user/forgot-password', { email }),

  // POST /api/v1/user/verify-otp/:email
  verifyOTP: (email, otp) => api.post(`/user/verify-otp/${email}`, { otp }),

  // POST /api/v1/user/change-password/:email
  changePassword: (email, data) => api.post(`/user/change-password/${email}`, data),

  // POST /api/v1/user/logout
  logout: () => api.post('/user/logout'),

  // GET  /api/v1/user/get-user/:userId
  getProfile: (userId) => api.get(`/user/get-user/${userId}`),
};