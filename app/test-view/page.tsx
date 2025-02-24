import { getAllFarmersWithBases } from '@/lib/db';

export default async function TestView() {
  const farmers = await getAllFarmersWithBases();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">農家一覧</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers.map((farmer: any) => (
          <div key={farmer.id} className="border rounded-lg p-6 shadow-md">
            {/* 農家画像 */}
            <div className="mb-4 relative">
              <img
                src={farmer.promotion_image_url}
                alt={farmer.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* 農家情報 */}
            <div>
              <h2 className="text-xl font-bold mb-2">{farmer.name}</h2>
              <p className="text-gray-600 mb-2">{farmer.location}</p>
              <p className="text-sm mb-4">{farmer.short_description}</p>

              {/* 拠点情報 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">受け渡し拠点</h3>
                <p>{farmer.base_name}</p>
                <p className="text-sm text-gray-600">
                  {farmer.base_area} ({farmer.base_station})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}