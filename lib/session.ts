// lib/session.ts
import { cookies } from 'next/headers';

// セッションを取得する関数
export async function getSession() {
  try {
    // ブラウザのクッキーからセッションIDを取得
    const sessionCookie = cookies().get('session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    // API経由でユーザー情報を取得
    const response = await fetch('/api/auth/me', {
      headers: {
        Cookie: `session=${sessionCookie.value}`
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}