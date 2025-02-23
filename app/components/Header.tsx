"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              width={150}
              height={50}
              className="h-auto"
            />
          </Link>
        </div>

        {/* デスクトップナビゲーション */}
        <div className="hidden md:flex items-center space-x-4">
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
          <Link 
            href="/communities" 
            className="text-black text-sm hover:text-gray-600"
          >
            コミュニティ一覧
          </Link>
        </div>
        {/*黒い背景のオーバレイ*/}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
        {/* モバイルメニュー */}
        <div className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          md:hidden z-50
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6">
            <button 
              className="absolute top-4 right-4 text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-6">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                    <Image
                    src="/images/logo/csaloop-logo.png"
                    alt="CSA LOOP"
                    width={100}  // メインロゴより少し小さめに
                    height={40}
                    className="h-auto"
                    />
                </Link>
            </div> 
            <div className="border-t border-gray-200 my-4"></div> {/* 区切り線 */}
            <div className="flex flex-col space-y-4 mt-8">
              <Link 
                href="/login" 
                className="text-black border border-blue-400 rounded-md py-2 px-6 text-center text-sm hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ログイン
              </Link>
              <Link 
                href="/register" 
                className="text-black border border-blue-400 rounded-md py-2 px-6 text-center text-sm hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                新規会員登録
              </Link>
              <div className="border-t border-gray-200 my-4"></div> {/* 区切り線 */}
              <Link 
                href="/communities" 
                className="text-gray-600 text-sm hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                コミュニティ一覧
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header