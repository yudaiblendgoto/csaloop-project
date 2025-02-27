// app/communities/components/Pagination.tsx
import Link from 'next/link'

export default function Pagination({ 
    currentPage, 
    totalPages, 
    baseUrl 
  }: { 
    currentPage: number, 
    totalPages: number, 
    baseUrl: string 
  }) {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-10 space-x-2">
        {currentPage > 1 && (
          <Link 
            href={`${baseUrl}&page=${currentPage - 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            前へ
          </Link>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link
            key={page}
            href={`${baseUrl}&page=${page}`}
            className={`px-4 py-2 border rounded ${
              currentPage === page 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}&page=${currentPage + 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            次へ
          </Link>
        )}
      </div>
    );
  }

  {/* これは後々カードの枚数が増えたら必要になる*/}