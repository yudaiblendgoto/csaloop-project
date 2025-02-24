// app/communities/page.tsx
import { getAllFarmersWithBases } from '@/lib/db';
import Image from 'next/image';

// 地域の重複を除去してユニークな配列を作成する関数
function getUniqueAreas(farmers: any[]) {
  const areas = farmers.map(farmer => farmer.base_area);
  return ['すべて', ...new Set(areas)];
}

export default async function CommunityPage() {
  const farmers = await getAllFarmersWithBases();
  const areas = getUniqueAreas(farmers);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ロゴ */}
      <div className="flex justify-center mb-12">
        <Image
          src="/images/logo/nex_community.png"
          alt="Community"
          width={300}
          height={100}
          className="h-auto"
        />
      </div>

      {/* エリアフィルター */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {areas.map((area) => (
            <button
              key={area}
              className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* 農家一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((farmer: any) => (
          <div key={farmer.id} className="border rounded-lg overflow-hidden shadow-md">
            {/* 農家の画像 */}
            <div className="relative h-64">
              <Image
                src={farmer.promotion_image_url}
                alt={farmer.name}
                fill
                className="object-cover"
              />
            </div>

            {/* テキスト情報 */}
            <div className="p-6">
              <div className="text-sm text-gray-600 mb-2">
                {farmer.base_area}_ {farmer.base_station}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">
                {farmer.name} @ {farmer.base_name}
              </h2>

              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  {farmer.location}
                </div>
                <div className="text-sm text-gray-500">
                  募集終了済
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}