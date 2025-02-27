import { createUsersTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createUsersTable();
    return NextResponse.json({ message: 'Users table created successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to setup database' },
      { status: 500 }
    );
  }
}