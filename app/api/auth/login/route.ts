import { loginUser } from '@/lib/db';
import { NextResponse } from 'next/server';

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
    
    // セッションデータの作成
    const sessionData = {
      userId: user.id,
      name: user.name,
      email: user.email
    };
    
    // レスポンスの作成
    const response = NextResponse.json({ 
      message: 'ログインに成功しました', 
      user 
    });
    
    // クッキーの設定
    response.cookies.set({
      name: 'session',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1週間
      path: '/'
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'ログインに失敗しました' },
      { status: 401 }
    );
  }
}