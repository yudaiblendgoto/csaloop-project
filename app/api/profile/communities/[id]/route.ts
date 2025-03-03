// app/api/profile/communities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { updateFarmer, getFarmerById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const farmer = await getFarmerById(params.id);
    
    if (!farmer) {
      return NextResponse.json(
        { error: 'コミュニティが見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ farmer });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'コミュニティの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const data = await request.json();
    
    // バリデーション
    if (!data.name || !data.location || !data.base_id) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // データベースを更新
    const farmerId = await updateFarmer(params.id, data, session.user.id);
    
    return NextResponse.json({ id: farmerId, success: true });
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'コミュニティの更新に失敗しました' },
      { status: 500 }
    );
  }
}

