"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter,useSearchParams } from 'next/navigation'
import Link from 'next/link'

// 新規コンポーネント: 検索パラメータを使用する部分を分離
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const searchParams = useSearchParams()

  useEffect(() => {
    // 登録成功時のメッセージ表示
    if (searchParams?.get('registered') === 'true') {
      setSuccess('会員登録が完了しました。ログインしてください。');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください');
      }

      // APIを呼び出し
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }

      /// ログイン成功時に完全なリロードを行う
      window.location.href = '/';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">ログイン</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          アカウントをお持ちでない方は{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            新規会員登録
          </Link>
        </p>
      </div>
    </div>
  );
}

// メインのログインページコンポーネント
export default function LoginPage() {
  // routerが未使用なので削除
  // const router = useRouter()

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}