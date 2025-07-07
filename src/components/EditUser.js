import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function EditUserModal({ user, setShowEditModal, setUsers }) {
    const [fullName, setFullName] = useState(user.fullName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(user.role.id);
    const [successMessage, setSuccessMessage] = useState("");
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/roles"); // Obtener roles del backend
                setRoles(response.data); // Establecer los roles en el estado
            } catch (error) {
                console.error("Error fetching roles:", error);
                setError("Failed to load roles.");
            }
        };

        fetchRoles();
    }, []); // El array vacío asegura que solo se ejecute una vez cuando se monta el componente

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {
            fullName: fullName,
            lastName: lastName,
            password: password,
            email: email,
            role: role
        };

        try {
            const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, updatedUser);
            setUsers((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser.id === user.id ? { ...prevUser, ...updatedUser } : prevUser
                )
            ); // Actualiza la lista de usuarios localmente
            setSuccessMessage("Product updated successfully!");
            setShowEditModal(false); // Cierra el modal después de un segundo
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = roles.find((r) => r.id === parseInt(e.target.value)); // Buscar el objeto completo
        setRole(selectedRole); // Establecer el objeto completo en el estado
    };

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
            <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit User</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowEditModal(false)}
                            />
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lasName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select
                                        id="role"
                                        value={role ? role.id : ""}
                                        onChange={(handleRoleChange)} // Actualizamos el rol como objeto
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((roleItem) => (
                                            <option key={roleItem.id} value={roleItem.id}>
                                                {roleItem.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">Update User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditUserModal;
