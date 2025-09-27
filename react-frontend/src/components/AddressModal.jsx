import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AddressModal = ({ show, onHide, address = null, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        streetAddress: "",
        detailAddress: "",
        province: "",
        district: "",
        subdistrict: "",
        postalCode: "",
    });

    // Reset form when modal opens/closes or address changes
    useEffect(() => {
        if (show) {
            if (address) {
                // Edit mode - populate form with existing data
                setFormData({
                    fullName: address.fullName || "",
                    phoneNumber: address.phone || "",
                    streetAddress: address.street || "",
                    detailAddress: address.detailAddress || "",
                    province: address.province || "",
                    district: address.district || "",
                    subdistrict: address.subdistrict || "",
                    postalCode: address.postalCode || "",
                });
            } else {
                // Create mode - reset form
                setFormData({
                    fullName: "",
                    phoneNumber: "",
                    streetAddress: "",
                    detailAddress: "",
                    province: "",
                    district: "",
                    subdistrict: "",
                    postalCode: "",
                });
            }
        }
    }, [show, address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.phoneNumber || !formData.streetAddress) {
            alert("Please fill in all required fields (Full Name, Phone Number, and Street Address)");
            return;
        }

        // Call the onSave callback with the form data
        onSave(formData, address?.id);

        // Close modal
        onHide();
    };

    const handleCancel = () => {
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-0 pb-2">
                <Modal.Title className="text-danger fw-bold">{address ? "Edit Address" : "Add Address"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-2">
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* Full Name */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Full Name *</Form.Label>
                            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>

                        {/* Phone Number */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Phone Number *</Form.Label>
                            <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="08234 123 2313" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Street Address */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Street Address *</Form.Label>
                            <Form.Control
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder="rimel111@gmail.com"
                                required
                                style={{ backgroundColor: "#f5f5f5" }}
                                className="border-0 py-2"
                            />
                        </Col>

                        {/* Detail Address */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Detail Address (optional)</Form.Label>
                            <Form.Control type="text" name="detailAddress" value={formData.detailAddress} onChange={handleInputChange} placeholder="+62 8123 4567 8910" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    {/* Address Section */}
                    <Row>
                        <Col md={12} className="mb-2">
                            <Form.Label className="fw-bold">Address</Form.Label>
                        </Col>
                    </Row>

                    <Row>
                        {/* Province */}
                        <Col md={12} className="mb-3">
                            <Form.Control type="text" name="province" value={formData.province} onChange={handleInputChange} placeholder="Province" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* District */}
                        <Col md={12} className="mb-3">
                            <Form.Control type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Subdistrict */}
                        <Col md={12} className="mb-3">
                            <Form.Control type="text" name="subdistrict" value={formData.subdistrict} onChange={handleInputChange} placeholder="Subdistrict" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Postal Code */}
                        <Col md={12} className="mb-4">
                            <Form.Control type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button variant="outline-secondary" onClick={handleCancel} className="px-4">
                            Cancel
                        </Button>
                        <Button variant="danger" type="submit" className="px-4 fw-semibold">
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddressModal;
