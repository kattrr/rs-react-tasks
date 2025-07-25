interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-100 text-gray-700 font-medium"
      >
        Preview
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded font-medium ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-100 text-gray-700 font-medium"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 