import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import AddressModal from "./AddressModal";
import AddressService from "../services/AddressService";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";

const AddressBook = () => {
    const { profile } = useOutletContext();
    const { handleError, showSuccess } = useApiErrorHandler();
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const addressService = new AddressService();
            const response = await addressService.getAddresses();
            setAddresses(response.data || []);
        } catch (error) {
            handleError(error, "Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        const address = addresses.find((addr) => addr.id === id);
        setSelectedAddress(address);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                setLoading(true);
                const addressService = new AddressService();
                await addressService.deleteAddress(id);
                showSuccess("Address deleted successfully!");
                await fetchAddresses();
            } catch (error) {
                handleError(error, "Failed to delete address");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddNew = () => {
        setSelectedAddress(null);
        setShowModal(true);
    };

    const handleSaveAddress = async (formData, addressId = null) => {
        try {
            setLoading(true);

            const addressData = {
                fullname: formData.fullname,
                phone: formData.phone,
                address: formData.address,
                detail: formData.detail || "",
                province: formData.province,
                district: formData.district,
                sub_district: formData.sub_district,
                village: formData.village,
                postal_code: formData.postal_code,
                pinned: formData.pinned ? 1 : 0,
            };

            const addressService = new AddressService();

            if (addressId) {
                // Edit existing address
                await addressService.updateAddress(addressId, addressData);
                showSuccess("Address updated successfully!");
            } else {
                // Add new address
                await addressService.addAddress(addressData);
                showSuccess("Address added successfully!");
            }

            // Refresh addresses
            await fetchAddresses();
            setShowModal(false);
        } catch (error) {
            handleError(error, "Failed to save address");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [profile]);

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Manage Address</h4>
                <Button variant="danger" className="fw-semibold" onClick={handleAddNew}>
                    Add New Address
                </Button>
            </div>

            {/* Address Cards */}
            <div className="d-flex flex-column gap-3">
                {loading && addresses.length === 0 ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : addresses.length === 0 ? (
                    <Card className="border-2">
                        <Card.Body className="p-4 text-center">
                            <p className="text-muted mb-0">No addresses found. Add your first address!</p>
                        </Card.Body>
                    </Card>
                ) : (
                    addresses.map((address) => (
                        <Card key={address.id} className="border-2">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <h6 className="fw-bold mb-0">{address.fullname}</h6>
                                            <p className="text-muted mb-0">| {address.phone}</p>
                                            {address.pinned === 1 && <span className="badge bg-danger">Pinned</span>}
                                        </div>
                                        <p className="text-muted mb-2">{address.address}</p>
                                        {address.detail && <p className="text-muted mb-2">{address.detail}</p>}
                                        <p className="text-muted mb-2">
                                            {address.village}, {address.sub_district}, {address.district}, {address.province}, {address.postal_code}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-secondary" size="sm" className="fw-semibold" onClick={() => handleEdit(address.id)} disabled={loading}>
                                            Edit
                                        </Button>
                                        <Button variant="outline-danger" size="sm" className="fw-semibold" onClick={() => handleDelete(address.id)} disabled={loading}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>

            {/* Address Modal */}
            <AddressModal show={showModal} onHide={() => setShowModal(false)} address={selectedAddress} onSave={handleSaveAddress} />
        </div>
    );
};

export default AddressBook;
