import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileLayout from "./layouts/ProfileLayout";
import MyProfile from "./components/profile/MyProfile";
import ChangePassword from "./components/profile/ChangePassword";
import AddressBook from "./components/AddressBook";
import OrderList from "./components/OrderList";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CategoryProvider } from "./contexts/CategoryContext";

function App() {
    return (
        <CategoryProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfileLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MyProfile />} />
                    <Route path="password" element={<ChangePassword />} />
                    <Route path="address" element={<AddressBook />} />
                    <Route path="orders/process" element={<OrderList orderType="process" />} />
                    <Route path="orders/deliveries" element={<OrderList orderType="deliveries" />} />
                    <Route path="orders/delivered" element={<OrderList orderType="delivered" />} />
                </Route>
                <Route
                    path="/carts"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </CategoryProvider>
    );
}

export default App;
