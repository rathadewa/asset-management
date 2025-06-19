"use client"

import { useState, useEffect } from 'react';

interface User {
  name: string;
}

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        setUser(JSON.parse(userJson));
      } catch (e) {
        console.error("Gagal mem-parsing data user dari localStorage", e);
        setUser(null);
      }
    }
  }, []); 

  return user;
}