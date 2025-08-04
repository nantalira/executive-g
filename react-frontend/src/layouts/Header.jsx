import React from "react";
import { Navbar, Nav, Container, Form, FormControl, NavDropdown } from "react-bootstrap";
import { PersonCircle, Cart, Search, Phone, Laptop, Watch, Camera, Headset, Joystick } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// Data kategori yang sama dengan CategorySection
const categories = [
    { id: 1, name: "Phones", icon: <Phone size={16} /> },
    { id: 2, name: "Computers", icon: <Laptop size={16} /> },
    { id: 3, name: "SmartWatch", icon: <Watch size={16} /> },
    { id: 4, name: "Camera", icon: <Camera size={16} /> },
    { id: 5, name: "HeadPhones", icon: <Headset size={16} /> },
    { id: 6, name: "Gaming", icon: <Joystick size={16} /> },
];

const Header = () => {
    return (
        <div className="position-fixed top-0 start-0 end-0" style={{ zIndex: 1000 }}>
            {/* 1. Announcement Bar */}
            <div className="bg-dark text-white text-center py-2">
                <p className="mb-0 small">
                    Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
                    <a href="#" className="text-white fw-bold ms-2 text-decoration-underline">
                        ShopNow
                    </a>
                </p>
            </div>

            {/* 2. Navbar Utama */}
            <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
                <Container>
                    <Navbar.Brand href="#home" className="fw-bolder fs-4">
                        Exclusive
                    </Navbar.Brand>

                    {/* Search - Always visible, responsive sizing */}
                    <div className="d-flex align-items-center order-lg-3">
                        {/* Mobile Search */}
                        <Form className="d-flex position-relative me-2 d-lg-none">
                            <FormControl type="search" placeholder="Search..." className="bg-light border-0 ps-3 pe-4" size="sm" style={{ width: "180px" }} />
                            <Search className="position-absolute end-0 me-2" style={{ top: "50%", transform: "translateY(-50%)" }} size={14} />
                        </Form>

                        {/* Desktop Search */}
                        <Form className="d-none d-lg-flex position-relative me-3">
                            <FormControl type="search" placeholder="What are you looking for?" className="bg-light border-0 ps-3 pe-5" style={{ width: "240px" }} />
                            <Search className="position-absolute end-0 me-3" style={{ top: "50%", transform: "translateY(-50%)" }} size={18} />
                        </Form>

                        {/* Icons - Desktop Only */}
                        <Cart size={24} className="me-2 d-none d-lg-block" role="button" />
                        <Link to="/login" className="text-dark">
                            <PersonCircle size={24} className="d-none d-lg-block" role="button" />
                        </Link>
                    </div>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="order-lg-2">
                        <Nav className="mx-auto">
                            <Nav.Link href="#new-arrival" className="active mx-3 fw-semibold">
                                New Arrival
                            </Nav.Link>
                            <NavDropdown title="Categories" id="categories-dropdown" className="mx-3" menuVariant="light">
                                {categories.map((category) => (
                                    <NavDropdown.Item key={category.id} href={`#category-${category.name.toLowerCase()}`} className="d-flex align-items-center py-2">
                                        <span className="me-3 ">{category.icon}</span>
                                        <span className="fw-medium">{category.name}</span>
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                            <Nav.Link href="#best-selling" className="mx-3 fw-semibold">
                                Best Selling
                            </Nav.Link>
                            <Nav.Link href="#about" className="mx-3 fw-semibold">
                                About
                            </Nav.Link>
                        </Nav>

                        {/* Mobile Cart & Account Links - Only visible on mobile */}
                        <Nav className="d-lg-none">
                            <hr className="my-2" />
                            <Nav.Link href="#cart" className="d-flex align-items-center mx-3 py-2">
                                <Cart size={20} className="me-3" />
                                <span className="fw-medium">My Cart</span>
                            </Nav.Link>
                            <Nav.Link href="#account" className="d-flex align-items-center mx-3 py-2">
                                <PersonCircle size={20} className="me-3" />
                                <span className="fw-medium">My Account</span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Header;
