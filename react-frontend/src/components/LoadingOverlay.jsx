import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingOverlay = ({ show = true, message = "Loading...", subMessage = "Please wait...", spinnerColor = "#dc3545" }) => {
    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 9999,
                backdropFilter: "blur(2px)",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                    textAlign: "center",
                    minWidth: "200px",
                    animation: "fadeInScale 0.3s ease-out",
                }}
            >
                <Spinner
                    animation="border"
                    role="status"
                    style={{
                        width: "3rem",
                        height: "3rem",
                        color: spinnerColor,
                        borderWidth: "3px",
                    }}
                >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <div className="mt-3">
                    <h6 className="mb-1 fw-semibold">{message}</h6>
                    <small className="text-muted">{subMessage}</small>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeInScale {
                        from {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingOverlay;
