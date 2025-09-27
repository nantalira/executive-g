import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import AddressModal from "./AddressModal";

const AddressBook = () => {
    // Sample addresses data - in real app this would come from props or API
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            label: "Home Address",
            street: "Jalan Raya Ciledug No.123, Larangan, Tangerang Selatan",
            city: "Banten, Indonesia, 15154",
            phone: "+62 812 3456 7890",
        },
        {
            id: 2,
            label: "Office Address",
            street: "Jl. Jend. Sudirman Kav. 52-53, SCBD",
            city: "Jakarta Selatan, DKI Jakarta, 12190",
            phone: "+62 21 5150 4000",
        },
        {
            id: 3,
            label: "Parent's House",
            street: "Jl. Mawar No. 45, Kebayoran Baru",
            city: "Jakarta Selatan, DKI Jakarta, 12110",
            phone: "+62 812 9876 5432",
        },
        {
            id: 4,
            label: "Apartment Address",
            street: "Apartemen Casablanca Mansion Tower A Lt.15 No.02",
            city: "Jakarta Selatan, DKI Jakarta, 12870",
            phone: "+62 811 2233 4455",
        },
        {
            id: 5,
            label: "Vacation House",
            street: "Jl. Pantai Kuta No. 88, Badung",
            city: "Bali, Indonesia, 80361",
            phone: "+62 361 756789",
        },
    ]);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleEdit = (id) => {
        const address = addresses.find((addr) => addr.id === id);
        setSelectedAddress(address);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        }
    };

    const handleAddNew = () => {
        setSelectedAddress(null);
        setShowModal(true);
    };

    const handleSaveAddress = (formData, addressId = null) => {
        if (addressId) {
            // Edit existing address
            setAddresses((prev) =>
                prev.map((addr) =>
                    addr.id === addressId
                        ? {
                              ...addr,
                              label: formData.fullName + "'s Address", // Generate label from name
                              street: formData.streetAddress,
                              city: `${formData.district}, ${formData.province}, ${formData.postalCode}`,
                              phone: formData.phoneNumber,
                              fullName: formData.fullName,
                              detailAddress: formData.detailAddress,
                              province: formData.province,
                              district: formData.district,
                              subdistrict: formData.subdistrict,
                              postalCode: formData.postalCode,
                          }
                        : addr
                )
            );
        } else {
            // Add new address
            const newAddress = {
                id: Math.max(...addresses.map((a) => a.id)) + 1,
                label: formData.fullName + "'s Address",
                street: formData.streetAddress,
                city: `${formData.district}, ${formData.province}, ${formData.postalCode}`,
                phone: formData.phoneNumber,
                fullName: formData.fullName,
                detailAddress: formData.detailAddress,
                province: formData.province,
                district: formData.district,
                subdistrict: formData.subdistrict,
                postalCode: formData.postalCode,
            };
            setAddresses((prev) => [...prev, newAddress]);
        }
    };

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
                {addresses.map((address) => (
                    <Card key={address.id} className="border-2">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-2">{address.label}</h6>
                                    <p className="text-muted mb-2">{address.street}</p>
                                    <p className="text-muted mb-2">{address.city}</p>
                                    <p className="text-muted mb-0">Phone: {address.phone}</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-secondary" size="sm" className="fw-semibold" onClick={() => handleEdit(address.id)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="fw-semibold" onClick={() => handleDelete(address.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Address Modal */}
            <AddressModal show={showModal} onHide={() => setShowModal(false)} address={selectedAddress} onSave={handleSaveAddress} />
        </div>
    );
};

export default AddressBook;
