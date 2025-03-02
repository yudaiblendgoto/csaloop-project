import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFarmerById } from '@/lib/db';

// 型定義
interface SeasonalProduct {
  id?: number;
  farmer_id?: number;
  season: string;
  products: string;
  created_at?: string;
  updated_at?: string;
}

interface Farmer {
  id: string;
  name: string;
  location: string;
  representative_name?: string;
  short_description?: string;
  full_description?: string;
  representative_image_url?: string;
  promotion_image_url: string;
  google_map_url?: string;
  
  // 拠点情報
  base_name: string;
  base_area: string;
  base_station: string;
  base_address: string;
  base_description?: string;
  base_image_url?: string;
  base_google_map_url?: string;
  
  // 受け渡し情報
  delivery_frequency: string;
  delivery_time: string;
  
  // 交流情報
  interaction_frequency?: string;
  interaction_details?: string;
  
  // 季節の野菜
  seasonal_products?: SeasonalProduct[];
}

// ローディングコンポーネント
function FarmerDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
      <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded mb-6 w-1/3"></div>
      <div className="h-32 bg-gray-300 rounded mb-6"></div>
    </div>
  );
}

// 季節ごとの野菜表示コンポーネント
function SeasonalProducts({ products }: { products: SeasonalProduct[] }) {
  if (!products || products.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">野菜の種類</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-800 font-medium mb-2">{item.season}：</div>
            <div className="whitespace-pre-line text-gray-600 text-sm">
              {item.products}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 農家詳細コンポーネント
async function FarmerDetail({ id }: { id: string }) {
  const farmer = await getFarmerById(id) as Farmer | null;
  
  if (!farmer) {
    return <div className="text-center py-10">指定されたコミュニティは見つかりませんでした</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* メインビジュアル */}
      <div className="relative h-64 md:h-96">
        <Image
          src={farmer.promotion_image_url || "/images/placeholder.jpg"}
          alt={farmer.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* 農家情報 */}
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">
            {farmer.base_area}_ {farmer.base_station}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {farmer.name} @ {farmer.base_name}
          </h1>
          
          {/* 農家情報ヘッダー */}
          <div className="flex items-center mb-4">
            <div className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium mr-2">農家</div>
            <div className="text-lg text-gray-700">
              {farmer.location}
            </div>
          </div>
        </div>
        
        {/* キャッチコピー */}
        {farmer.short_description && (
          <div className="mb-8 text-xl text-gray-700 font-medium">
            {farmer.short_description}
          </div>
        )}
        
        {/* 詳細説明 */}
        <div className="mb-8">
          <div className="whitespace-pre-line text-gray-700">
            {farmer.full_description}
          </div>
        </div>
        
        {/* 季節の野菜 */}
        <SeasonalProducts products={farmer.seasonal_products || []} />
        
        {/* 受け渡し情報 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">受け渡し</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-gray-600">
            <div className="mb-2">
              <span className="font-medium">頻度：</span>{farmer.delivery_frequency}
            </div>
            <div>
              <span className="font-medium">※</span>{farmer.delivery_time}
            </div>
            <div className="mt-2">
              <span className="font-medium">場所：</span>{farmer.base_name}（{farmer.base_address}）
              <a href={farmer.base_google_map_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">&gt; google map</a>
            </div>
          </div>
        </div>
        
        {/* 畑での交流 */}
        {farmer.interaction_frequency && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">畑での交流</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
              <div className="mb-2">
                <span className="font-medium">頻度：</span>{farmer.interaction_frequency}
              </div>
              <div>
                <span className="font-medium">主な作業：</span>{farmer.interaction_details}
              </div>
            </div>
          </div>
        )}
        
        {/* 拠点情報 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">拠点</h2>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
            <div className="flex items-start">
              {farmer.base_image_url && (
                <div className="w-16 h-16 mr-4 overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                  <Image
                    src={farmer.base_image_url}
                    alt={farmer.base_name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div>
                <div className="font-medium text-lg mb-1">{farmer.base_name}</div>
                <div className="text-gray-600 mb-2">
                  {farmer.base_address} <a href={farmer.base_google_map_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">&gt; google map</a>
                </div>
                <div className="text-gray-600 mb-3">{farmer.base_station}</div>
                {farmer.base_description && (
                  <div className="whitespace-pre-line text-sm text-gray-700 mt-2">
                    {farmer.base_description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CommunityDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // paramsをawaitする
  const resolvedParams = await (params as Promise<{ id: string }>);
  
  return (
    <div className="w-full mx-auto px-4 py-12 bg-white">
      <div className="container mx-auto px-4 pt-4 pb-2">
        <div className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">TOP</Link>
          {" > "}
          <Link href="/communities" className="hover:text-gray-700">すべてのコミュニティ</Link>
          {" > "}コミュニティ詳細
        </div>
      </div>
      
      <div className="container mx-auto max-w-4xl">
        <Suspense fallback={<FarmerDetailLoading />}>
          <FarmerDetail id={resolvedParams.id} />
        </Suspense>
      </div>
      
      {/* 申し込みボタン（募集終了状態） */}
      <div className="container mx-auto max-w-4xl mt-8 text-center">
        <div className="mb-2 text-gray-500">現在こちらのコミュニティは募集を</div>
        <div className="text-lg font-bold mb-6 text-gray-500">終了しております。</div>
        <button disabled className="bg-gray-400 text-white font-bold py-3 px-8 rounded-full shadow-lg cursor-not-allowed">
          募集終了しました
        </button>
      </div>
    </div>
  );
}