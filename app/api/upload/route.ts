// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as 'farmers' | 'bases';
    const id = Number(formData.get('id'));
    const type = formData.get('type') as 'representative' | 'promotion' | 'base';

    if (!file || !folder || !id || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const url = await uploadImage(file, folder, id, type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}