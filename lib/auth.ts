// lib/auth.ts
import { cookies } from 'next/headers';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
}

// サーバーサイドでのユーザー認証チェック
export async function getServerSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    try {
      return JSON.parse(sessionCookie.value) as UserSession;
    } catch (e) {
      console.error('Invalid session format:', e);
      return null;
    }
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}