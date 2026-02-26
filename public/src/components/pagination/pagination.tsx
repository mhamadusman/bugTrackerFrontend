import React from 'react';

interface IPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    updatePage: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalItems, updatePage }: IPaginationProps) => {
    const pages: (number | string)[] = [];
    const limit = 6;

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pages.push("...");
        }
    }

    const uniquePages = pages.filter((item, index) => pages.indexOf(item) === index);

    return (
        <>
            <div className='lg:px-20 px-3'>

                <div className="flex shrink-0 flex-wrap  items-center justify-between  py-4 bg-gray-50 border-t border-gray-100 gap-4">


                    <div className="text-[11px] font-inter text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{startItem}</span> to <span className="font-semibold text-gray-900">{endItem}</span> of <span className="font-semibold text-gray-900">{totalItems}</span> items
                    </div>


                    <div className="flex items-center gap-1">
                        {uniquePages.map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && updatePage(page)}
                                className={`
                            px-3 py-1 rounded-md text-xs font-poppins transition-all
                            ${page === currentPage
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-200 cursor-pointer'} 
                            ${page === "..." ? 'cursor-default hover:bg-transparent' : ''}
                        `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

export default Pagination;