// app/api/db/init/route.ts を作成
import { NextResponse } from 'next/server';
import { createAllTables, createUsersTable, createUsersFarmersTable } from '@/lib/db';

export async function GET() {
  try {
    // 開発環境でのみ実行可能に制限
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: '開発環境でのみ使用できます' }, { status: 403 });
    }
    
    // テーブルを作成
    await createAllTables();
    await createUsersTable();
    await createUsersFarmersTable();
    
    return NextResponse.json({ 
      success: true, 
      message: 'すべてのテーブルを作成しました' 
    });
  } catch (error) {
    console.error('テーブル作成エラー:', error);
    return NextResponse.json({ 
      error: `テーブル作成に失敗しました: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 });
  }
}