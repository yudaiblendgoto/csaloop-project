// app/communities/page.tsx
import { Suspense } from 'react';
import { getAllAreas, getFarmersWithPagination } from '@/lib/db';
import Link from 'next/link'
import FarmerCard from './components/FarmerCard';
import Pagination from './components/Pagination';

// ストリーミング用のローディングコンポーネント
function FarmersLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden shadow animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 農家リストコンポーネント
async function FarmersList({ area, page }: { area: string, page: number }) {
  const pageSize = 9;
  const { farmers, total } = await getFarmersWithPagination(area, page, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  if (farmers.length === 0) {
    return <p className="text-center py-10">該当するコミュニティはありません</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((farmer: any) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>
      
      <Pagination currentPage={page} totalPages={totalPages} baseUrl={`/communities?area=${encodeURIComponent(area)}`} />
    </>
  );
}

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { area?: string | string[], page?: string };
}) {
  const searchParamsData = await searchParams;
  
  const areaParam = typeof searchParamsData.area === 'string' ? searchParamsData.area : 
                    Array.isArray(searchParamsData.area) ? searchParamsData.area[0] : undefined;
  const pageParam = typeof searchParamsData.page === 'string' ? parseInt(searchParamsData.page, 10) : 1;
  
  const selectedArea = areaParam || 'すべて';
  const currentPage = isNaN(pageParam) ? 1 : pageParam;
  const areas = await getAllAreas();

  return (
    <div className="w-full mx-auto px-4 py-12 bg-white">
        <div className="container mx-auto px-4 pt-4 pb-2">
            <div className="text-sm text-gray-500">
                <a href="/" className="hover:text-gray-700">TOP</a> {" > "} すべてのコミュニティ
            </div>
        </div>
      {/* コミュニティロゴ */}
      <div className="flex justify-center mb-16">
        <img
          src="/images/logo/nex_community.png"
          alt="COMMUNITY"
          className="h-20 w-auto"
        />
      </div>
      {/* エリアフィルター */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {areas.map(area => (
          <Link
            key={area}
            href={`/communities?area=${encodeURIComponent(area)}`}
            className={`px-4 py-2 rounded-full border ${
              selectedArea === area
                ? 'bg-gray-200 border-gray-400 text-black'
                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-800 border-2'
            } transition-colors`}
          >
            {area}
          </Link>
        ))}
      </div>

      {/* 農家一覧（Suspenseでラップしてストリーミングレンダリング） */}
      <Suspense fallback={<FarmersLoading />}>
        <FarmersList area={selectedArea} page={currentPage} />
      </Suspense>
    </div>
  );
}