"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import LogoutButton from './LogoutButton'

type User = {
  userId: number;
  name: string;
  email: string;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // ログイン情報を取得
    const getUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        console.log('User data from API:', data); // デバッグ用
        
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to get user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUser();
  }, []);

  return (
    <header className="w-full py-4 bg-white relative">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* ハンバーガーメニュー */}
        <button 
          className="md:hidden text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* ロゴ */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo/csaloop-logo.png"
              alt="CSA LOOP"
              width={200}
              height={50}
              className="h-auto"
            />
          </Link>
        </div>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <span className="text-sm">読み込み中...</span>
          ) : user ? (
            <>
              <Link 
                href="/profile" 
                className="text-black text-sm hover:text-gray-600"
              >
                マイページ
              </Link>
              <span className="text-black text-sm">
                こんにちは、{user.name}さん
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-black text-sm hover:text-gray-600"
              >
                ログイン
              </Link>
              <Link 
                href="/register" 
                className="text-black text-sm hover:text-gray-600"
              >
                新規会員登録
              </Link>
            </>
          )}
          <div className="w-px h-6 bg-gray-300 mx-4"></div>
          <Link 
            href="/communities" 
            className="text-gray-600 text-sm hover:text-gray-900"
          >
            コミュニティ一覧
          </Link>
        </div>

        {/* モバイルメニュー（左から出てくる） */}
        <div className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          md:hidden z-50
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* メニューの内容 */}
          <div className="p-6">
            {/* ロゴ */}
            <div className="flex justify-center mb-6">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image
                  src="/images/logo/csaloop-logo.png"
                  alt="CSA LOOP"
                  width={150}
                  height={40}
                  className="h-auto"
                />
              </Link>
            </div>

            {/* メニュークローズボタン */}
            <button 
              className="absolute top-4 right-4 text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* メニューリンク */}
            <div className="flex flex-col space-y-4 mt-8">
              {isLoading ? (
                <span className="text-sm">読み込み中...</span>
              ) : user ? (
                <>
                  <Link 
                    href="/profile" 
                    className="text-black hover:text-gray-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    マイページ
                  </Link>
                  <span className="text-black text-sm py-2">
                    こんにちは、{user.name}さん
                  </span>
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/auth/logout', { method: 'POST' });
                        if (response.ok) {
                          window.location.href = '/';
                        }
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}
                    className="text-black text-sm hover:text-gray-600 py-2 text-left"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-black hover:text-gray-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ログイン
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-black hover:text-gray-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    新規会員登録
                  </Link>
                </>
              )}
              <div className="border-t border-gray-200 my-4"></div>
              <Link 
                href="/communities" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                コミュニティ一覧
              </Link>
            </div>
          </div>
        </div>
        
        {/* 暗い背景のオーバーレイ */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  )
}

export default Header