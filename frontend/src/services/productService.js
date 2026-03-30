import api from './api';

export const productService = {
  // GET /api/products?category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
  // Returns: { products: [], total, page, pages }
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },

  // GET /api/products/featured  →  { products: [] }
  getFeatured: () => api.get('/products/featured'),

  // GET /api/products/categories  →  { categories: [] }
  getCategories: () => api.get('/products/categories'),

  // GET /api/products/:id  →  { product }
  getById: (id) => api.get(`/products/${id}`),

  // GET /api/products/:id/related  →  { products: [] }
  getRelated: (id) => api.get(`/products/${id}/related`),

  // POST /api/products/:id/reviews  →  { review }
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};