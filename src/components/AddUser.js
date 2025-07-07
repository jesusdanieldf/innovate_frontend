import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function AddUser({ setShowUserModal, updateUsersList }) {
    const [fullName, setFullName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(null); // Cambiado para almacenar el objeto completo
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [roles, setRoles] = useState([]); // Estado para los roles

    // Cargar roles cuando el componente se monte
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

        const newUser = { fullName, lastName, email, password, role }; // Enviamos el objeto completo del rol

        try {
            // Enviar la nueva creación de usuario al backend
            const response = await axios.post("http://localhost:8080/api/users", newUser);

            // Agregar el nuevo usuario a la lista en User.js
            updateUsersList(response.data);

            // Limpiar los campos del formulario
            setFullName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRole(null); // Restablecer el estado de rol

            // Establecer éxito y restablecer el error
            setSuccess(true);
            setError(null);

            // Cerrar el modal después de un segundo
            setTimeout(() => setShowUserModal(false), 10);
        } catch (error) {
            console.error("Error adding user:", error.response ? error.response.data : error);
            setError("Failed to create user. Please try again.");
            setSuccess(false);
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
                            <h5 className="modal-title">Add New User</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setShowUserModal(false)} // Cerrar el modal
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">User created successfully!</div>}

                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter fullname"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter last name"
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
                                        placeholder="Enter email"
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
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select
                                        id="role"
                                        value={role ? role.id : ""}
                                        onChange={handleRoleChange} // Actualizamos el rol como objeto
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
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddUser;
