import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { AsyncPaginate } from "react-select-async-paginate";
import MasterDataService from "../services/MasterDataService";

const AddressModal = ({ show, onHide, address = null, onSave }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        address: "",
        detail: "",
        province: "",
        district: "",
        sub_district: "",
        village: "",
        postal_code: "",
        pinned: false,
    });

    // Selected values for AsyncPaginate
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [paginationData] = useState({
        items_per_page: 15,
    });

    // Load functions for AsyncPaginate
    const loadProvinces = async (searchQuery, loadedOptions, { page }) => {
        try {
            const response = await MasterDataService.getProvinces(page, searchQuery, paginationData.items_per_page);
            const options = response.data.map((province) => ({
                value: province.id,
                label: province.name,
            }));

            const hasMore = response.pagination ? page < response.pagination.total_pages : false;

            return {
                options,
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading provinces:", error);
            return { options: [], hasMore: false };
        }
    };

    const loadDistricts = async (searchQuery, loadedOptions, { page }) => {
        if (!selectedProvince) return { options: [], hasMore: false };
        try {
            const response = await MasterDataService.getDistricts(selectedProvince.value, page, searchQuery, paginationData.items_per_page);
            const options = response.data.map((district) => ({
                value: district.id,
                label: district.name,
            }));

            const hasMore = response.pagination ? page < response.pagination.total_pages : false;

            return {
                options,
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading districts:", error);
            return { options: [], hasMore: false };
        }
    };

    const loadSubDistricts = async (searchQuery, loadedOptions, { page }) => {
        if (!selectedDistrict) return { options: [], hasMore: false };
        try {
            const response = await MasterDataService.getSubDistricts(selectedDistrict.value, page, searchQuery, paginationData.items_per_page);
            const options = response.data.map((subDistrict) => ({
                value: subDistrict.id,
                label: subDistrict.name,
            }));

            const hasMore = response.pagination ? page < response.pagination.total_pages : false;

            return {
                options,
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading sub districts:", error);
            return { options: [], hasMore: false };
        }
    };

    const loadVillages = async (searchQuery, loadedOptions, { page }) => {
        if (!selectedSubDistrict) return { options: [], hasMore: false };
        try {
            const response = await MasterDataService.getVillages(selectedSubDistrict.value, page, searchQuery, paginationData.items_per_page);
            const options = response.data.map((village) => ({
                value: village.id,
                label: village.name,
            }));

            const hasMore = response.pagination ? page < response.pagination.total_pages : false;

            return {
                options,
                hasMore,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error("Error loading villages:", error);
            return { options: [], hasMore: false };
        }
    };

    // Reset form when modal opens/closes or address changes
    useEffect(() => {
        if (show) {
            if (address) {
                // Edit mode - populate form with existing data
                setFormData({
                    fullname: address.fullname || "",
                    phone: address.phone || "",
                    address: address.address || "",
                    detail: address.detail || "",
                    province: address.province || "",
                    district: address.district || "",
                    sub_district: address.sub_district || "",
                    village: address.village || "",
                    postal_code: address.postal_code || "",
                    pinned: address.pinned === 1,
                });

                // Set selected values untuk AsyncPaginate (edit mode)
                // Note: Dalam implementasi nyata, ini mungkin perlu disesuaikan dengan struktur data yang sebenarnya
                setSelectedProvince(address.province ? { value: null, label: address.province } : null);
                setSelectedDistrict(address.district ? { value: null, label: address.district } : null);
                setSelectedSubDistrict(address.sub_district ? { value: null, label: address.sub_district } : null);
                setSelectedVillage(address.village ? { value: null, label: address.village } : null);
            } else {
                // Create mode - reset form
                setFormData({
                    fullname: "",
                    phone: "",
                    address: "",
                    detail: "",
                    province: "",
                    district: "",
                    sub_district: "",
                    village: "",
                    postal_code: "",
                    pinned: false,
                });

                // Reset selected values
                setSelectedProvince(null);
                setSelectedDistrict(null);
                setSelectedSubDistrict(null);
                setSelectedVillage(null);
            }
        }
    }, [show, address]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handlers for AsyncPaginate selections
    const handleProvinceChange = (selectedOption) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setSelectedSubDistrict(null);
        setSelectedVillage(null);
        setFormData((prev) => ({
            ...prev,
            province: selectedOption ? selectedOption.label : "",
            district: "",
            sub_district: "",
            village: "",
        }));
    };

    const handleDistrictChange = (selectedOption) => {
        setSelectedDistrict(selectedOption);
        setSelectedSubDistrict(null);
        setSelectedVillage(null);
        setFormData((prev) => ({
            ...prev,
            district: selectedOption ? selectedOption.label : "",
            sub_district: "",
            village: "",
        }));
    };

    const handleSubDistrictChange = (selectedOption) => {
        setSelectedSubDistrict(selectedOption);
        setSelectedVillage(null);
        setFormData((prev) => ({
            ...prev,
            sub_district: selectedOption ? selectedOption.label : "",
            village: "",
        }));
    };

    const handleVillageChange = (selectedOption) => {
        setSelectedVillage(selectedOption);
        setFormData((prev) => ({
            ...prev,
            village: selectedOption ? selectedOption.label : "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation sesuai API docs
        if (!formData.fullname || !formData.phone || !formData.address || !formData.province || !formData.district || !formData.sub_district || !formData.village || !formData.postal_code) {
            alert("Please fill in all required fields");
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
                            <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} placeholder="Full Name" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>

                        {/* Phone */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Phone *</Form.Label>
                            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="1234567890" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Address */}
                        <Col md={12} className="mb-3">
                            <Form.Label className="fw-medium">Address *</Form.Label>
                            <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Main street address" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Detail Address */}
                        <Col md={12} className="mb-3">
                            <Form.Label className="fw-medium">Detail (optional)</Form.Label>
                            <Form.Control type="text" name="detail" value={formData.detail} onChange={handleInputChange} placeholder="Nearby landmark" style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Province */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Province *</Form.Label>
                            <AsyncPaginate
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                loadOptions={loadProvinces}
                                additional={{
                                    page: 1,
                                }}
                                placeholder="Select Province"
                                isClearable
                                isSearchable
                                debounceTimeout={300}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: "#f5f5f5",
                                        border: "none",
                                        minHeight: "40px",
                                    }),
                                }}
                            />
                        </Col>

                        {/* District */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">District *</Form.Label>
                            <AsyncPaginate
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                loadOptions={loadDistricts}
                                additional={{
                                    page: 1,
                                }}
                                placeholder={!selectedProvince ? "Select Province first" : "Select District"}
                                isClearable
                                isSearchable
                                debounceTimeout={300}
                                isDisabled={!selectedProvince?.value}
                                key={selectedProvince?.value || "district-disabled"}
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isDisabled ? "#e9ecef" : "#f5f5f5",
                                        border: "none",
                                        minHeight: "40px",
                                        opacity: state.isDisabled ? 0.6 : 1,
                                    }),
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        {/* Sub District */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Sub District *</Form.Label>
                            <AsyncPaginate
                                value={selectedSubDistrict}
                                onChange={handleSubDistrictChange}
                                loadOptions={loadSubDistricts}
                                additional={{
                                    page: 1,
                                }}
                                placeholder={!selectedDistrict ? "Select District first" : "Select Sub District"}
                                isClearable
                                isSearchable
                                debounceTimeout={300}
                                isDisabled={!selectedDistrict?.value}
                                key={selectedDistrict?.value || "subdistrict-disabled"}
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isDisabled ? "#e9ecef" : "#f5f5f5",
                                        border: "none",
                                        minHeight: "40px",
                                        opacity: state.isDisabled ? 0.6 : 1,
                                    }),
                                }}
                            />
                        </Col>

                        {/* Village */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Village *</Form.Label>
                            <AsyncPaginate
                                value={selectedVillage}
                                onChange={handleVillageChange}
                                loadOptions={loadVillages}
                                additional={{
                                    page: 1,
                                }}
                                placeholder={!selectedSubDistrict ? "Select Sub District first" : "Select Village"}
                                isClearable
                                isSearchable
                                debounceTimeout={300}
                                isDisabled={!selectedSubDistrict?.value}
                                key={selectedSubDistrict?.value || "village-disabled"}
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isDisabled ? "#e9ecef" : "#f5f5f5",
                                        border: "none",
                                        minHeight: "40px",
                                        opacity: state.isDisabled ? 0.6 : 1,
                                    }),
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        {/* Postal Code */}
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-medium">Postal Code *</Form.Label>
                            <Form.Control type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} placeholder="12345" required style={{ backgroundColor: "#f5f5f5" }} className="border-0 py-2" />
                        </Col>
                    </Row>

                    <Row>
                        {/* Pinned Address Checkbox */}
                        <Col md={12} className="mb-3">
                            <Form.Check type="checkbox" name="pinned" checked={formData.pinned} onChange={handleInputChange} label="Set as pinned address" className="fw-medium" />
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
