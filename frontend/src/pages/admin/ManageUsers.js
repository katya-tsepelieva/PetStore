import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/manage-users.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/admin/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    axios.delete(`/admin/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const handleMakeAdmin = (userId) => {
    axios.put(`/admin/users/${userId}/make-admin`)
      .then(() => {
        setUsers(users.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user
        ));
      })
      .catch((error) => {
        console.error("Error making user admin:", error);
      });
  };

  return (
    <div className="manage-users">
      <h1>Управління користувачами</h1>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" && (
                    <button onClick={() => handleMakeAdmin(user.id)}>
                      Зробити адміністратором
                    </button>
                  )}
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
