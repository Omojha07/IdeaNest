import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  // ✅ Fetch Users from the server
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        params: { search, role, sort }
      });

      console.log("✅ Fetched Users:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    fetchUsers();
  }, [search, role, sort]);

  return (
    <div className="flex-1 p-4 md:p-8">
     <h1
  className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-700 to-purple-800 mb-10 text-center cursor-pointer transition-all hover:scale-105 hover:from-gray-700 hover:via-blue-600 hover:to-purple-700'
  onClick={() => navigate('/admin')}
>
  🚀 Admin Dashboard
</h1>

      {/* MAIN HEADER */}
      <h2 className="text-4xl font-bold text-yellow-600 mb-8 text-center">
        Users
      </h2>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        />

        {/* Role Dropdown */}
        <select
          onChange={(e) => setRole(e.target.value)}
          className="w-full md:w-40 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        >
          <option value="">All</option>
          <option value="mentor">Mentors</option>
          <option value="user">Students</option>
        </select>

        {/* Sort Dropdown */}
        <select
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-40 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        >
          <option value="">Default</option>
          <option value="name">Sort by Name</option>
          <option value="newest">Sort by Newest</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-600">Loading users...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Display Users */}
      {!loading && users.length > 0 ? (
        <div>
          {/* <h3 className="text-3xl font-semibold text-yellow-600 mb-6">Users</h3> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id || user.email}
                className="p-6 bg-white border border-yellow-400 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-yellow-600">
                        {user.name}
                      </h3>
                      <span
                            className={`
    px-3 py-1 text-xs font-semibold rounded-full shadow-md text-white
    ${
      user.role === 'admin'
        ? 'bg-red-500'
        : user.role === 'student'
        ? 'bg-blue-500'
        : user.role === 'mentor'
        ? 'bg-green-500'
        : 'bg-gray-500'
    }
  `}
                          >
                            {user.role}
                          </span>
                    </div>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 col-span-full">
            No users found.
          </p>
        )
      )}
    </div>
  );
}

export default Users;
