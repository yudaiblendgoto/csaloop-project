import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { getAllBases } from '@/lib/db';

export async function GET() {
  try {
    // セッション確認
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const bases = await getAllBases();
    
    return NextResponse.json({ bases });
  } catch (error) {
    console.error('Error fetching bases:', error);
    return NextResponse.json(
      { error: 'コミュニティ拠点の取得に失敗しました' },
      { status: 500 }
    );
  }
}