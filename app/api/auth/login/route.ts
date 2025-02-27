import { loginUser } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }
    
    const user = await loginUser(email, password);
    
    // 認証成功時にセッションクッキーを設定
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify({
      userId: user.id,
      name: user.name,
      email: user.email
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1週間
      path: '/'
    });
    
    return NextResponse.json({ 
      message: 'ログインに成功しました', 
      user 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'ログインに失敗しました' },
      { status: 401 }
    );
  }
}