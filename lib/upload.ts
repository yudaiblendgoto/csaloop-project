// lib/upload.ts
import { put } from '@vercel/blob';

export async function uploadImage(
  file: File,
  folder: 'farmers' | 'bases',
  id: number,
  type: 'representative' | 'promotion' | 'base'
) {
  try {
    const filename = `${type}.png`;  // 現在の画像がpngなのでpngに変更
    const pathname = `${folder}/${id}/${filename}`;

    const blob = await put(pathname, file, {
      access: 'public',
    });

    return blob.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}