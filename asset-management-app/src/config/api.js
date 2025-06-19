const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000',

  ENDPOINTS: {
    assets: '/api/assets',
    delete_asset: '/api/assets/delete/:id',
    users: '/api/users',
    request: '/api/requests',
    login: '/api/auth/login'
  }
};

export default API_CONFIG;