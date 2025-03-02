import Link from 'next/link';
import Image from 'next/image';

interface Farmer {
  id: string;
  name: string;
  promotion_image_url: string;
  base_area: string;
  base_station: string;
  base_name: string;
  location: string;
}

export default function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <Link href={`/communities/${farmer.id}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow transition-transform hover:translate-y-[-5px]">
        {/* 農家の画像 */}
        <div className="h-64 relative">
          <Image
            src={farmer.promotion_image_url || "/images/placeholder.jpg"}
            alt={farmer.name}
            fill
            className="object-cover"
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
    </Link>
  );
}