import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // セッションクッキーを削除
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ message: 'ログアウトしました' });
  } catch (error) {
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    );
  }
}