import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

function UsersManagement({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Estado para los usuarios filtrados
  const [showModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Usuario autenticado
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el término de búsqueda

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Número de usuarios por página

  // Obtener los usuarios y el usuario autenticado
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Establecer los usuarios filtrados al cargar
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });

    // Obtener el usuario autenticado
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(storedUser);
  }, []);

  // Filtrar usuarios según el término de búsqueda
  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users); // Si no hay consulta, mostrar todos los usuarios
    }
  }, [searchQuery, users]); // Ejecutar cuando la búsqueda o los usuarios cambien

  // Obtener los usuarios que se deben mostrar en la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateUsersList = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setFilteredUsers((prevUsers) => [...prevUsers, newUser]); // Agregar también a los usuarios filtrados
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // También actualizar los usuarios filtrados
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Determinar el número de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">User Management</h1>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-outline-primary" onClick={() => setShowUserModal(true)}>
          <i className="bi bi-plus-circle"></i> New User
        </button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => {
            // Variables de permisos basadas en el rol
            const canEdit = loggedInUser?.role?.name === "Admin"; // Solo el admin puede editar
            const canDelete = loggedInUser?.role?.name === "Admin"; // Solo el admin puede eliminar

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role.name}</td>
                <td>
                  {canEdit ? (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editUser(user)}
                    >
                      <i className="bi bi-pencil"></i> {/* Icono de lápiz */}
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm me-2" disabled>
                      <i className="bi bi-lock"></i>
                    </button>
                  )}
                  {canDelete ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      <i className="bi bi-trash"></i> {/* Icono de basura */}
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <i className="bi bi-lock"></i> {/* Icono de bloqueo */}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          {/* Flecha Anterior */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; {/* Flecha izquierda */}
            </button>
          </li>

          {/* Números de página */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${number === currentPage ? "active" : ""}`}
            >
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}

          {/* Flecha Siguiente */}
          <li className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              &raquo; {/* Flecha derecha */}
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal para agregar nuevo usuario */}
      {showModal && (
        <AddUser setShowUserModal={setShowUserModal} updateUsersList={updateUsersList} />
      )}

      {/* Modal para editar usuario */}
      {showEditModal && selectedUser && (
        <EditUser
          user={selectedUser}
          setShowEditModal={setShowEditModal}
          setUsers={setUsers}
        />
      )}
    </div>
  );
}

export default UsersManagement;
