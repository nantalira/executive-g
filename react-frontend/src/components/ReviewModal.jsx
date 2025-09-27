import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

const ReviewModal = ({ show, onHide, order = null, onSave }) => {
    const [formData, setFormData] = useState({
        rating: 0,
        message: "",
        picture: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRatingClick = (rating) => {
        setFormData((prev) => ({
            ...prev,
            rating: rating,
        }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            picture: file,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.rating === 0) {
            alert("Please select a rating");
            return;
        }

        if (!formData.message.trim()) {
            alert("Please write a message");
            return;
        }

        // Call the onSave callback with the form data
        onSave(formData, order?.id);

        // Reset form and close modal
        setFormData({
            rating: 0,
            message: "",
            picture: null,
        });
        onHide();
    };

    const handleCancel = () => {
        // Reset form and close modal
        setFormData({
            rating: 0,
            message: "",
            picture: null,
        });
        onHide();
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} onClick={() => handleRatingClick(i)} style={{ cursor: "pointer", fontSize: "24px", marginRight: "5px" }}>
                    {i <= formData.rating ? <StarFill className="text-warning" /> : <Star className="text-muted" />}
                </span>
            );
        }
        return stars;
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-0 pb-2">
                <Modal.Title className="text-danger fw-bold">Add Review</Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-2">
                <Form onSubmit={handleSubmit}>
                    {/* Overall Product Rating */}
                    <Row className="mb-4">
                        <Col>
                            <Form.Label className="fw-medium mb-3">Overall Product</Form.Label>
                            <div className="d-flex align-items-center">{renderStars()}</div>
                        </Col>
                    </Row>

                    {/* Message Section */}
                    <Row className="mb-4">
                        <Col>
                            <Form.Label className="fw-medium mb-3">Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Share your thoughts about the product"
                                required
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    minHeight: "100px",
                                    border: "1px solid #e0e0e0",
                                }}
                                className="py-3"
                            />
                        </Col>
                    </Row>

                    {/* Picture Upload Section */}
                    <Row className="mb-4">
                        <Col>
                            <Form.Label className="fw-medium mb-3">Picture</Form.Label>
                            <div
                                className="border-2 border-dashed rounded p-5 text-center"
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    borderColor: "#ddd",
                                    minHeight: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePictureChange}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        opacity: 0,
                                        cursor: "pointer",
                                    }}
                                />
                                <div className="text-center">
                                    {formData.picture ? (
                                        <div>
                                            <p className="mb-0 text-success fw-medium">Selected: {formData.picture.name}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mb-2">
                                                <span className="text-muted fs-1">📷</span>
                                            </div>
                                            <p className="mb-0 text-muted">Click to upload or drag and drop</p>
                                            <small className="text-muted">PNG, JPG or GIF (max. 5MB)</small>
                                        </div>
                                    )}
                                </div>
                            </div>
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

export default ReviewModal;
