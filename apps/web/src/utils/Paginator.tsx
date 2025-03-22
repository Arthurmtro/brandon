interface PaginatorProps {
  minPage: number;
  maxPage: number;
  page: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  minPage,
  maxPage,
  page,
  onPageChange,
}) => {
  const pagesToShow = 4; // Nombre de pages immédiatement voisines affichées

  const getPageNumbers = () => {
    const start = Math.max(minPage, page - pagesToShow);
    const end = Math.min(maxPage, page + pagesToShow);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Aller à la première page */}
      <button
        onClick={() => onPageChange(minPage)}
        disabled={page === minPage}
        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ⏮️
      </button>

      {/* Page précédente */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === minPage}
        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ◀️
      </button>

      {/* Numéros de pages */}
      {getPageNumbers().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg ${
            p === page ? "bg-blue-500 text-white" : "hover:bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Page suivante */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === maxPage}
        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ▶️
      </button>

      {/* Aller à la dernière page */}
      <button
        onClick={() => onPageChange(maxPage)}
        disabled={page === maxPage}
        className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
      >
        ⏭️
      </button>
    </div>
  );
};

export default Paginator;
