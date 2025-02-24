// app/api/seed/route.ts
import { seedDatabase } from '@/lib/seed';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        message: result.message,
        status: 'success'
      });
    } else {
      return NextResponse.json({
        message: 'Failed to seed database',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed API route:', error);
    return NextResponse.json({
      message: 'Error occurred while seeding database',
      error: error.message
    }, { status: 500 });
  }
}