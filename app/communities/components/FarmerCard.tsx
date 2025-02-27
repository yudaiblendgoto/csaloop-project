// app/communities/components/FarmerCard.tsx
export default function FarmerCard({ farmer }: { farmer: any }) {
    return (
      <div className="border rounded-lg overflow-hidden shadow">
        {/* 農家の画像 */}
        <div className="h-64 relative">
          <img
            src={farmer.promotion_image_url}
            alt={farmer.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* テキスト情報 */}
        <div className="p-5">
          <div className="text-sm text-gray-800 mb-1">
            {farmer.base_area}_ {farmer.base_station}
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            {farmer.name} @ {farmer.base_name}
          </h2>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">{farmer.location}</div>
            <div className="text-sm text-gray-500">募集終了済</div>
          </div>
        </div>
      </div>
    );
  }