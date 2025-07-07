import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/styleUser.css"; // Importar los estilos personalizados
import AddUser from "./AddUser";
import EditUser from "./EditUser";

function UsersManagement({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users data:", error);
      });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(storedUser);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateUsersList = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setFilteredUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  // Función para determinar la clase del rol
  const getRoleClass = (roleName) => {
    const baseClass = "user-role-badge";
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return `${baseClass} user-role-admin`;
      case 'user':
        return `${baseClass} user-role-user`;
      case 'moderator':
        return `${baseClass} user-role-moderator`;
      case 'manager':
        return `${baseClass} user-role-manager`;
      default:
        return `${baseClass} user-role-user`;
    }
  };

  return (
    <div className="user-container">
      {/* Header Section */}
      <div className="user-header">
        <div className="user-header-content">
          <div className="user-header-title">
            <h1 className="user-title">
              <i className="bi bi-people-fill"></i>
              User Management
            </h1>
            <p className="user-subtitle">
              Manage and organize your system users
            </p>
          </div>
          <div className="user-header-stats">
            <div className="user-count">
              {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="user-controls">
        <div className="user-search-section">
          <div className="user-search-container">
            <i className="bi bi-search user-search-icon"></i>
            <input
              type="text"
              className="user-search-input"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="user-add-button-section">
          <button 
            className="user-add-btn" 
            onClick={() => setShowUserModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
            New User
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="user-table-container">
        <div className="user-table-card">
          <div className="user-table-responsive">
            <table className="user-table">
              <thead className="user-table-header">
                <tr>
                  <th className="user-table-th">
                    <i className="bi bi-hash"></i>ID
                  </th>
                  <th className="user-table-th">
                    <i className="bi bi-person"></i>Name
                  </th>
                  <th className="user-table-th">
                    <i className="bi bi-person-badge"></i>Last Name
                  </th>
                  <th className="user-table-th">
                    <i className="bi bi-envelope"></i>Email
                  </th>
                  <th className="user-table-th">
                    <i className="bi bi-shield-check"></i>Role
                  </th>
                  <th className="user-table-th">
                    <i className="bi bi-gear"></i>Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => {
                  const canEdit = loggedInUser?.role?.name === "Admin";
                  const canDelete = loggedInUser?.role?.name === "Admin";

                  return (
                    <tr key={user.id} className="user-table-row">
                      <td className="user-table-td">
                        <span className="user-id">{user.id}</span>
                      </td>
                      <td className="user-table-td">
                        <div className="user-name-info">
                          <div className="user-name-icon">
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <span className="user-name-text">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="user-table-td">
                        <div className="user-lastname-info">
                          <div className="user-lastname-icon">
                            <i className="bi bi-person-badge"></i>
                          </div>
                          <span className="user-lastname-text">{user.lastName}</span>
                        </div>
                      </td>
                      <td className="user-table-td">
                        <span className="user-email-badge">{user.email}</span>
                      </td>
                      <td className="user-table-td">
                        <span className={getRoleClass(user.role.name)}>
                          {user.role.name}
                        </span>
                      </td>
                      <td className="user-table-td">
                        <div className="user-action-buttons">
                          {canEdit ? (
                            <button
                              className="user-action-btn user-edit-btn"
                              onClick={() => editUser(user)}
                              title="Edit User"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          ) : (
                            <button 
                              className="user-action-btn user-locked-btn" 
                              disabled
                              title="No permissions"
                            >
                              <i className="bi bi-lock"></i>
                            </button>
                          )}
                          {canDelete ? (
                            <button
                              className="user-action-btn user-delete-btn"
                              onClick={() => deleteUser(user.id)}
                              title="Delete User"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          ) : (
                            <button 
                              className="user-action-btn user-locked-btn" 
                              disabled
                              title="No permissions"
                            >
                              <i className="bi bi-lock"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {currentUsers.length === 0 && (
        <div className="user-empty-state">
          <div className="user-empty-content">
            <i className="bi bi-people user-empty-icon"></i>
            <h3 className="user-empty-title">No users found</h3>
            <p className="user-empty-text">
              {searchQuery 
                ? `No users match "${searchQuery}". Try adjusting your search terms.`
                : "There are no users in the system yet. Create your first user to get started."
              }
            </p>
            {!searchQuery && (
              <button 
                className="user-empty-add-btn"
                onClick={() => setShowUserModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                Add First User
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pageNumbers.length > 1 && (
        <div className="user-pagination-container">
          <ul className="user-pagination">
            <li className={`user-page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="user-page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {pageNumbers.map((number) => (
              <li
                key={number}
                className={`user-page-item ${number === currentPage ? "active" : ""}`}
              >
                <button 
                  onClick={() => paginate(number)} 
                  className="user-page-link"
                >
                  {number}
                </button>
              </li>
            ))}

            <li className={`user-page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}>
              <button
                className="user-page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <AddUser setShowUserModal={setShowUserModal} updateUsersList={updateUsersList} />
      )}

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