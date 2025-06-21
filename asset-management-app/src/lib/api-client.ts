

import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://34.101.34.165:3000'

function handleLogout() {  
//   localStorage.removeItem('user');
  Cookies.remove('token');
  // toast.error("Sesi Anda telah berakhir", {
  //   description: "Silakan login kembali untuk melanjutkan.",
  // });
  // window.location.href = '/login';
}

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('token');

  const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>),
};
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    handleLogout();
    throw new Error("UNAUTORIZED");
  }

  return response;
};



