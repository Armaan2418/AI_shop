import api from './api';

export const cartService = {
  // POST /api/cart/validate-coupon  →  { code, discount: 0.10 }
  validateCoupon: (code) => api.post('/cart/validate-coupon', { code }),

  // POST /api/orders  →  { order }
  placeOrder: (data) => api.post('/orders', data),

  // GET /api/orders  →  { orders: [] }
  getOrders: () => api.get('/orders'),

  // GET /api/orders/:id  →  { order }
  getOrderById: (id) => api.get(`/orders/${id}`),

  // PUT /api/orders/:id/cancel  →  { order }
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};