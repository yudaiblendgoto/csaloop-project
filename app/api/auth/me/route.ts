import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ user: null });
    }
    
    // 既存のAPIと同じレスポンス形式を維持
    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ user: null });
  }
}