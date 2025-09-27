import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Shop, CurrencyDollar, Bag, Cash, Truck, Headset, ShieldCheck } from "react-bootstrap-icons";

const AboutPage = () => {
    // Statistics data
    const statistics = [
        {
            icon: <Shop size={40} className="text-white" />,
            number: "10.5k",
            label: "Sallers active our site",
            bgColor: "black",
        },
        {
            icon: <CurrencyDollar size={40} className="text-white" />,
            number: "33k",
            label: "Monthly Product Sale",
            bgColor: "#DB4444",
        },
        {
            icon: <Bag size={40} className="text-white" />,
            number: "45.5k",
            label: "Customer active in our site",
            bgColor: "black",
        },
        {
            icon: <Cash size={40} className="text-white" />,
            number: "25k",
            label: "Annual gross sale in our site",
            bgColor: "black",
        },
    ];

    // Team members data
    const teamMembers = [
        {
            id: 1,
            name: "Tom Cruise",
            position: "Founder & Chairman",
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            twitter: "#",
            instagram: "#",
            linkedin: "#",
        },
        {
            id: 2,
            name: "Emma Watson",
            position: "Managing Director",
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            twitter: "#",
            instagram: "#",
            linkedin: "#",
        },
        {
            id: 3,
            name: "Will Smith",
            position: "Product Designer",
            image: "https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg",
            twitter: "#",
            instagram: "#",
            linkedin: "#",
        },
    ];

    // Services data
    const services = [
        {
            icon: <Truck size={50} className="text-white" />,
            title: "FREE AND FAST DELIVERY",
            description: "Free delivery for all orders over $140",
        },
        {
            icon: <Headset size={50} className="text-white" />,
            title: "24/7 CUSTOMER SERVICE",
            description: "Friendly 24/7 customer support",
        },
        {
            icon: <ShieldCheck size={50} className="text-white" />,
            title: "MONEY BACK GUARANTEE",
            description: "We return money within 30 days",
        },
    ];

    return (
        <MainLayout>
            <Container className="py-4">
                {/* Breadcrumb */}
                <Row className="mb-5">
                    <Col>
                        <Link to="/" className="text-decoration-none">
                            <span className="text-muted">Home</span>
                        </Link>
                        <span className="mx-2 text-muted">/</span>
                        <span className="text-dark">About</span>
                    </Col>
                </Row>

                {/* Our Story Section */}
                <Row className="mb-5 align-items-center">
                    <Col lg={6} className="mb-4 mb-lg-0">
                        <h1 className="fw-bold mb-4 display-6">Our Story</h1>
                        <p className="mb-4 text-muted lh-base">
                            Launced in 2015, Exclusive is South Asia's premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has
                            10,500 sallers and 300 brands and serves 3 millioons customers across the region.
                        </p>
                        <p className="text-muted lh-base">Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.</p>
                    </Col>
                    <Col lg={6}>
                        <div className="position-relative">
                            <div
                                className="rounded-3 d-flex align-items-center justify-content-center"
                                style={{
                                    background: "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)",
                                    height: "400px",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src="https://exclusive-api.nantalira.site/storage/products/images/01K1K1VBA4KNQ63JXAF9B1W4ZH.jpg"
                                    alt="Shopping"
                                    className="img-fluid rounded-3"
                                    style={{
                                        maxHeight: "90%",
                                        maxWidth: "90%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Statistics Section */}
                <Row className="mb-5 g-4">
                    {statistics.map((stat, index) => (
                        <Col key={index} sm={6} lg={3}>
                            <Card
                                className="text-center h-100 border-2 hover-card"
                                style={{
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <Card.Body className="py-4">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            backgroundColor: stat.bgColor,
                                        }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <h3 className="fw-bold mb-2">{stat.number}</h3>
                                    <p className="text-muted mb-0 small">{stat.label}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Team Section */}
                <Row className="mb-5 g-4">
                    {teamMembers.map((member) => (
                        <Col key={member.id} lg={4} md={6}>
                            <Card className="border-0 text-center">
                                <div className="bg-light rounded-3 d-flex align-items-end justify-content-center position-relative" style={{ height: "400px", overflow: "hidden" }}>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "85%",
                                            maxWidth: "85%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                                <Card.Body className="px-0 pt-4">
                                    <h5 className="fw-bold mb-1">{member.name}</h5>
                                    <p className="text-muted mb-3">{member.position}</p>
                                    <div className="d-flex justify-content-center gap-3">
                                        <a href={member.twitter} className="text-dark">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa" }}>
                                                T
                                            </div>
                                        </a>
                                        <a href={member.instagram} className="text-dark">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa" }}>
                                                I
                                            </div>
                                        </a>
                                        <a href={member.linkedin} className="text-dark">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", backgroundColor: "#f8f9fa" }}>
                                                L
                                            </div>
                                        </a>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Services Section */}
                <Row className="justify-content-center g-4">
                    {services.map((service, index) => (
                        <Col key={index} lg={4} md={6} className="text-center">
                            <div className="mb-4">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#000",
                                    }}
                                >
                                    {service.icon}
                                </div>
                                <h5 className="fw-bold mb-2">{service.title}</h5>
                                <p className="text-muted">{service.description}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Custom CSS for hover effects */}
            <style jsx>{`
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </MainLayout>
    );
};

export default AboutPage;
