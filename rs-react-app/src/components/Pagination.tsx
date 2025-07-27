interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    if (currentPage <= 2) {
      return [1, 2, 3, 4];
    }
    if (currentPage >= totalPages - 1) {
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      role="navigation"
      className="flex justify-center items-center gap-2 mt-6"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:bg-gray-100 text-gray-700 font-medium"
      >
        Previous
      </button>
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded font-medium ${1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-2">...</span>}
        </>
      )}
      {pageNumbers.map((page) => (
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
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded font-medium ${totalPages === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
          >
            {totalPages}
          </button>
        </>
      )}
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
