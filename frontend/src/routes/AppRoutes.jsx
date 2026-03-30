// Route path constants — import these wherever you use navigate() or <Link to>
export const ROUTES = {
  HOME:           '/',
  PRODUCTS:       '/products',
  PRODUCT:        (id)  => `/products/${id}`,
  LOGIN:          '/login',
  REGISTER:       '/register',
  VERIFY_EMAIL:   '/verify-email',
  CART:           '/cart',
  CHECKOUT:       '/checkout',
  ORDER_SUCCESS:  '/order-success',
  DASHBOARD:      '/dashboard',
  ORDER_TRACKING: (id) => `/dashboard/orders/${id}`,
};