const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.248.202:3000',

  ENDPOINTS: {
    assets: '/api/assets',
    get_asset: '/api/assets/get',
    users: '/api/users',
    request: '/api/requests',
    get_request: '/api/requests/get',
    login: '/api/auth/login'
  }
};

export default API_CONFIG;