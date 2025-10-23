// src/components/CustomPagination.jsx
import React from "react";
import { Pagination } from "react-bootstrap";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
    // Jangan render apa-apa jika hanya ada satu halaman atau kurang
    if (totalPages <= 1) {
        return null;
    }

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    return (
        <>
            <style>
                {`
                    /* Styling untuk Custom Pagination */
                    /* Mengubah warna border dan teks default */
                    .custom-pagination .page-link {
                        color: #333; /* Warna teks hitam/abu tua */
                        border-color: #dee2e6; /* Warna border abu-abu muda */
                    }

                    /* Menghilangkan shadow saat focus */
                    .custom-pagination .page-link:focus {
                        box-shadow: none;
                    }

                    /* Styling saat kursor diarahkan (hover) */
                    .custom-pagination .page-item:not(.active) .page-link:hover {
                        color: #DB4444; /* Warna teks merah aksen */
                        border-color: #DB4444; /* Warna border merah aksen */
                        background-color: #fdecec; /* Latar belakang merah sangat pucat */
                    }

                    /* Styling untuk halaman yang sedang aktif */
                    .custom-pagination .page-item.active .page-link {
                        background-color: #DB4444; /* Latar belakang merah aksen */
                        border-color: #DB4444; /* Border merah aksen */
                        color: white; /* Teks putih */
                    }

                    /* Styling untuk tombol disabled (Prev/Next di ujung) */
                    .custom-pagination .page-item.disabled .page-link {
                        color: #6c757d; /* Warna teks abu-abu */
                    }
                `}
            </style>
            <div className="d-flex justify-content-center mt-5">
                <Pagination className="custom-pagination">
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageClick(currentPage - 1)} />
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageClick(pageNumber)}>
                                {pageNumber}
                            </Pagination.Item>
                        );
                    })}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageClick(currentPage + 1)} />
                </Pagination>
            </div>
        </>
    );
};

export default CustomPagination;
