// app/profile/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  userId: number;
  name: string;
  email: string;
}

interface Farmer {
  id: string;
  name: string;
  location: string;
  base_name: string;
  base_area: string;
  base_station: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Farmer[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
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
        
        // ユーザーが取得できたら、管理中のコミュニティも取得
        setCommunitiesLoading(true);
        try {
          const communitiesResponse = await fetch('/api/profile/communities');
          if (communitiesResponse.ok) {
            const communitiesData = await communitiesResponse.json();
            setCommunities(communitiesData.farmers || []);
          }
        } catch (err) {
          console.error('Failed to fetch communities:', err);
        } finally {
          setCommunitiesLoading(false);
        }
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
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">マイページ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ユーザー情報パネル */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-blue-500 text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm text-gray-600 mb-1">ユーザー名</h2>
                <p className="text-lg font-medium text-gray-800">{user.name}</p>
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm text-gray-600 mb-1">メールアドレス</h2>
                <p className="text-lg font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>
          
          {/* コミュニティ管理パネル */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">管理中のコミュニティ</h2>
                <Link
                  href="/profile/communities/new"
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
                >
                  新規作成
                </Link>
              </div>
              
              {communitiesLoading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">読み込み中...</p>
                </div>
              ) : communities.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">管理中のコミュニティはありません</p>
                  <p className="text-gray-500 text-sm">
                    新規コミュニティを作成して、CSA LOOPを始めましょう！
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communities.map((community) => (
                    <div key={community.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">
                              {community.base_area}_ {community.base_station}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                              {community.name} @ {community.base_name}
                            </h3>
                            <div className="text-sm text-gray-600 mt-1">{community.location}</div>
                          </div>
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            管理中
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-4">
                          <Link 
                            href={`/communities/${community.id}`} 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            詳細を表示
                          </Link>
                          <span className="text-gray-300">|</span>
                          <Link 
                            href={`/profile/communities/edit/${community.id}`} 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            編集する
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 text-right">
                    <Link 
                      href="/profile/communities" 
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      すべての管理コミュニティを表示 →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}