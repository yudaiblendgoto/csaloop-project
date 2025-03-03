// app/api/profile/communities/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';  // 正しいimport
import { getFarmersByUser } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {  // あなたの実装ではsession.userではなくsession自体をチェック
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    console.log('Session userId:', session.userId);  // デバッグ用
    
    const farmers = await getFarmersByUser(session.userId);  // session.user.idではなくsession.userId
    console.log('Farmers found:', farmers?.length || 0);  // デバッグ用
    
    return NextResponse.json({ farmers });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'コミュニティの取得に失敗しました' },
      { status: 500 }
    );
  }
}