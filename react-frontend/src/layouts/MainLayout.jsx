import React from "react";
import Header from "./Header";
import Footer from "./Footer"; // Assuming you have a Footer component

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            <div style={{ paddingTop: "100px" }}>{children}</div>
            <Footer />
        </>
    );
};

export default MainLayout;
