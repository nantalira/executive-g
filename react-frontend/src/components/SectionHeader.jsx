// src/components/SectionHeader.jsx
import React from "react";

const SectionHeader = ({ title, subTitle, children }) => {
    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <div style={{ width: "20px", height: "40px", backgroundColor: "#DB4444", borderRadius: "4px" }}></div>
                <h2 className="ms-3 fs-5 fw-bold text-danger mb-0">{title}</h2>
            </div>
            <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold fs-2">{subTitle}</h2>
                {children}
            </div>
        </>
    );
};

export default SectionHeader;
