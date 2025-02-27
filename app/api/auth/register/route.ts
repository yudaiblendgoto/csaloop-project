import { registerUser } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '必須フィールドがありません' },
        { status: 400 }
      );
    }
    
    const user = await registerUser(name, email, password);
    
    return NextResponse.json({ 
      message: '登録が完了しました', 
      user 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '登録に失敗しました' },
      { status: 500 }
    );
  }
}