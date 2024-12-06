import { ChevronLeft, ChevronRight } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-4">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <ChevronLeft />
            </button>

            {totalPages > 6 ? (
                <>
                    {currentPage > 3 && (
                        <>
                            <button onClick={() => setCurrentPage(1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">1</button>
                            {currentPage > 4 && <span className="px-2">...</span>}
                        </>
                    )}
                    {currentPage - 1 > 0 && (
                        <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{currentPage - 1}</button>
                    )}
                    <button className="px-4 py-2 border rounded-lg bg-blue-500 text-white">{currentPage}</button>
                    {currentPage + 1 <= totalPages && (
                        <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{currentPage + 1}</button>
                    )}
                    {currentPage < totalPages - 2 && (
                        <>
                            {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                            <button onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{totalPages}</button>
                        </>
                    )}
                </>
            ) : (
                Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                    >
                        {index + 1}
                    </button>
                ))
            )}

            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default Pagination;