// src/components/SectionHeader.jsx
import React from "react";

const SectionHeader = ({ title, subTitle, children }) => {
    return (
        <>
            {/* Baris pertama untuk judul "Today's" (ini sudah benar) */}
            <div className="d-flex align-items-center mb-3">
                <div style={{ width: "20px", height: "40px", backgroundColor: "#DB4444", borderRadius: "4px" }}></div>
                <h2 className="ms-3 fs-5 fw-bold text-danger mb-0">{title}</h2>
            </div>

            {/* Baris kedua: Gabungkan subtitle dan children dalam satu flex container */}
            <div className="d-flex align-items-end mb-4">
                {/* Tampilkan subTitle di sini */}
                <h2 className="fw-bold fs-2 mb-0 me-5">{subTitle}</h2>
                {/* me-5 (margin-end) memberi jarak ke elemen berikutnya (countdown) */}

                {/* Render children (countdown dan button) di sisa ruang */}
                {children}
            </div>
        </>
    );
};

export default SectionHeader;
