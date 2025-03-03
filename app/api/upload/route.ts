import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';
import { getServerSession } from '@/lib/auth';

// 10MBの最大サイズ
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    // フォームデータからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as 'farmers' | 'bases' || 'farmers';
    const id = Number(formData.get('id')) || Date.now(); // IDがない場合はタイムスタンプを使用
    const type = formData.get('type') as 'representative' | 'promotion' | 'base' || 'promotion';

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });
    }

    // サイズチェック
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'ファイルサイズは10MB以下にしてください' }, { status: 400 });
    }

    // ファイルタイプの確認
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { error: '画像はJPEG、PNG、またはWEBP形式のみ許可されています' },
        { status: 400 }
      );
    }

    // 既存の uploadImage 関数を使用
    const url = await uploadImage(file, folder, id, type);
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: '画像のアップロードに失敗しました' },
      { status: 500 }
    );
  }
}