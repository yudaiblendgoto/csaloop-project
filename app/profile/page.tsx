// app/profile/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  userId: number;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!data.user) {
          // ユーザーが見つからない場合はログインページにリダイレクト
          router.push('/login');
          return;
        }
        
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg text-red-500">ログインが必要です</p>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center min-h-screen bg-white py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">マイページ</h1>
        
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="mb-6">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-500 text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-sm text-gray-600 mb-1">ユーザー名</h2>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-sm text-gray-600 mb-1">メールアドレス</h2>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-sm text-gray-600 mb-1">ユーザーID</h2>
              <p className="text-lg font-medium">{user.userId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}