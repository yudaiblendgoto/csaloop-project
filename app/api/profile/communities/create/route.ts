import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { createFarmer } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const data = await request.json();
    
    // バリデーション
    if (!data.name || !data.location) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 拠点情報の検証
    if (!data.base_id && (!data.custom_base || !data.custom_base.name)) {
      return NextResponse.json(
        { error: '拠点を選択するか、新規拠点情報を入力してください' },
        { status: 400 }
      );
    }
    
    // データベースに保存
    const farmerId = await createFarmer(data, session.userId);
    
    return NextResponse.json({ id: farmerId, success: true });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'コミュニティの作成に失敗しました' },
      { status: 500 }
    );
  }
}