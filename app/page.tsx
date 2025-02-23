// app/page.tsx
"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen">
      {/* ヒーローセクション - パララックス効果 */}
      <section className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/images/bg/hero-bg.png"  // 背景画像を用意してください
            alt="Hero background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 
            className="text-6xl font-bold mb-4"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
            }}
          >
            CSA LOOP
          </h1>
          <p 
            className="text-xl"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            地域支援型農業の新たな形
          </p>
        </div>
      </section>

      {/* コンテンツセクション - スクロールアニメーション */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-black text-4xl font-bold mb-8"
              style={{
                transform: `translateX(${Math.min(0, -100 + scrollY * 0.2)}px)`,
                opacity: Math.min(1, (scrollY - 300) * 0.005),
              }}
            >
              CSA LOOPとは
            </h2>
            <p 
              className="text-black mb-8 "
              style={{
                transform: `translateX(${Math.min(0, 100 - scrollY * 0.2)}px)`,
                opacity: Math.min(1, (scrollY - 400) * 0.005),
              }}
            >
              CSA（地域支援型農業）とLOOP（食循環）を掛け合わせた新たな仕組みです。
              お試しエフェクト コード理解してないからせねばならぬところ
            </p>
          </div>
        </div>
      </section>

      {/* 特徴セクション - 回転アニメーション */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            style={{
              transform: `rotate(${Math.min(0, (scrollY - 800) * 0.02)}deg)`,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="bg-white p-6 rounded-lg shadow-lg"
                style={{
                  transform: `translateY(${Math.min(0, 100 - (scrollY - 800) * 0.2)}px)`,
                  opacity: Math.min(1, (scrollY - 800) * 0.005),
                }}
              >
                <h3 className="text-xl font-bold mb-4">特徴 {i}</h3>
                <p>特徴の説明がここに入ります。</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フッターセクション */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-center">© 20250301 CSALOOP. ごとちゃんぺ.</p>
        </div>
      </footer>
    </main>
  )
}