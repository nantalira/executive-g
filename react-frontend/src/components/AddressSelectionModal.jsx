import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import addressService from "../services/addressService";

const AddressSelectionModal = ({ show, onHide, onAddressSelect }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (show) {
            fetchAddresses();
        }
    }, [show]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await addressService.getAddresses();
            console.log("Addresses response:", response);

            // Success response structure: { message, data }
            if (response && response.data) {
                console.log("Setting addresses:", response.data);
                setAddresses(Array.isArray(response.data) ? response.data : []);
            } else if (response && response.message) {
                console.log("Response message but no data:", response.message);
                setAddresses([]);
            } else {
                console.log("Unexpected response structure:", response);
                setAddresses([]);
            }
        } catch (err) {
            console.error("Error fetching addresses:", err);
            console.error("Error details:", {
                message: err.message,
                data: err.data,
                status: err.status,
            });
            // Error structure from interceptor: { message, data, status }
            if (err.data?.errors?.message) {
                setError(err.data.errors.message[0] || "Failed to load addresses");
            } else {
                setError(err.message || "Failed to load addresses");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAddress = () => {
        if (selectedAddress && onAddressSelect) {
            onAddressSelect(selectedAddress);
            onHide();
        }
    };

    const handleSetAsPinned = async (addressId) => {
        try {
            // Update the address to be pinned
            const addressToPin = addresses.find((addr) => addr.id === addressId);
            if (addressToPin) {
                const response = await addressService.updateAddress(addressId, {
                    ...addressToPin,
                    pinned: 1,
                });

                // Check if update was successful
                if (response.message) {
                    // Refresh addresses
                    await fetchAddresses();
                }
            }
        } catch (err) {
            console.error("Error setting address as pinned:", err);
            // Error structure from interceptor: { message, data, status }
            if (err.data?.errors?.message) {
                setError(err.data.errors.message[0] || "Failed to set address as pinned");
            } else {
                setError(err.message || "Failed to set address as pinned");
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Loading addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">No addresses found. Please add an address first.</p>
                    </div>
                ) : (
                    <div className="address-list">
                        {addresses.map((address) => (
                            <Card key={address.id} className={`mb-3 cursor-pointer ${selectedAddress?.id === address.id ? "border-danger" : ""}`} onClick={() => setSelectedAddress(address)} style={{ cursor: "pointer" }}>
                                <Card.Body>
                                    <Row>
                                        <Col xs={1}>
                                            <Form.Check type="radio" name="addressSelect" checked={selectedAddress?.id === address.id} onChange={() => setSelectedAddress(address)} />
                                        </Col>
                                        <Col xs={11}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1 fw-bold">
                                                        {address.fullname}
                                                        {address.pinned === 1 && <span className="badge bg-danger ms-2 small">Pinned</span>}
                                                    </h6>
                                                    <p className="mb-1 text-muted small">{address.phone}</p>
                                                    <p className="mb-1">{address.address}</p>
                                                    {address.detail && <p className="mb-1 text-muted small">{address.detail}</p>}
                                                    <p className="mb-0 text-muted small">
                                                        {address.village}, {address.sub_district}, {address.district}, {address.province} {address.postal_code}
                                                    </p>
                                                </div>
                                                {address.pinned !== 1 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetAsPinned(address.id);
                                                        }}
                                                    >
                                                        Set as Pinned
                                                    </Button>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleSelectAddress} disabled={!selectedAddress}>
                    Select Address
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddressSelectionModal;
