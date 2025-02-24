import { testConnection, createAllTables } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // データベース接続テスト
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ 
        message: 'Database connection failed' 
      }, { status: 500 });
    }

    // テーブル作成
    const tablesCreated = await createAllTables();
    if (!tablesCreated) {
      return NextResponse.json({ 
        message: 'Failed to create tables' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Database setup completed successfully' 
    });

  } catch (error) {
    console.error('Error in database setup:', error);
    return NextResponse.json({ 
      message: 'Error occurred during database setup' 
    }, { status: 500 });
  }
}