// app/api/upload-test-data/route.ts

import { promises as fs } from 'fs';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// アップロード済みのファイルをチェックする関数
async function checkIfFileExists(pathname: string) {
  try {
    const response = await fetch(`${process.env.BLOB_URL_PREFIX}/${pathname}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  try {
    const results = {
      success: [] as string[],
      skipped: [] as string[],
      failed: [] as string[]
    };

    // farmersの画像をアップロード
    for (let i = 1; i <= 4; i++) {
      try {
        // promotion画像
        const promotionPath = `farmers/${i}/promotion.png`;
        if (!(await checkIfFileExists(promotionPath))) {
          const promotionFile = await fs.readFile(`public/images/${promotionPath}`);
          await put(promotionPath, new Blob([promotionFile]), {
            access: 'public',
          });
          results.success.push(promotionPath);
        } else {
          results.skipped.push(promotionPath);
        }

        // representative画像
        const representativePath = `farmers/${i}/representative.png`;
        if (!(await checkIfFileExists(representativePath))) {
          const representativeFile = await fs.readFile(`public/images/${representativePath}`);
          await put(representativePath, new Blob([representativeFile]), {
            access: 'public',
          });
          results.success.push(representativePath);
        } else {
          results.skipped.push(representativePath);
        }
      } catch (error) {
        console.error(`Error uploading farmer ${i} images:`, error);
        results.failed.push(`farmers/${i}`);
      }
    }

    // basesの画像をアップロード
    for (let i = 1; i <= 4; i++) {
      try {
        const basePath = `bases/${i}/base.png`;
        if (!(await checkIfFileExists(basePath))) {
          const baseFile = await fs.readFile(`public/images/${basePath}`);
          await put(basePath, new Blob([baseFile]), {
            access: 'public',
          });
          results.success.push(basePath);
        } else {
          results.skipped.push(basePath);
        }
      } catch (error) {
        console.error(`Error uploading base ${i} image:`, error);
        results.failed.push(`bases/${i}`);
      }
    }

    return NextResponse.json({
      message: 'Upload process completed',
      results: {
        uploaded: results.success.length,
        skipped: results.skipped.length,
        failed: results.failed.length,
        details: results
      }
    });

  } catch (error) {
    console.error('Upload process failed:', error);
    return NextResponse.json(
      { error: 'Upload process failed', details: error.message },
      { status: 500 }
    );
  }
}