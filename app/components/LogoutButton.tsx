// app/components/LogoutButton.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // 完全なページリロードを強制
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-black text-sm hover:text-gray-600"
    >
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}