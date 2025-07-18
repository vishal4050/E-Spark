import React, { useEffect, useState } from 'react'
import "./users.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Layout from '../utils/Layout';
import toast from 'react-hot-toast';

const server = "http://localhost:5000"

const Users = ({ user }) => {
  const navigate = useNavigate();
  if (user && user.role !== "admin") return navigate("/")
  
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token")
        }
      })
      setUsers(data.users)
      setFilteredUsers(data.users) // Initialize filtered users
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users])

  const updateRole = async (id) => {
    toast.dismiss();
    if (confirm("Are you sure you want to update this user's role ?")) {
      try {
        const { data } = await axios.put(`${server}/api/user/${id}`, {}, {
          headers: {
            token: localStorage.getItem("token")
          }
        });
        toast.success(data.message);
        fetchUsers();
      }
      catch (error) {
        toast.error(error.response.data.message);
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const clearSearch = () => {
    setSearchTerm("");
  }

  return (
    <Layout>
      <div>
        <h1>Users</h1>
        
        {/* Search Input */}
        <div className="search-container" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '300px',
              marginRight: '10px'
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                padding: '10px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '10px', color: '#666' }}>
          {searchTerm ? `Found ${filteredUsers.length} user(s) matching "${searchTerm}"` : `Total users: ${users.length}`}
        </div>

        <table>
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers && filteredUsers.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>
                  <button
                    onClick={() => updateRole(e._id)}
                    className='common-btn'
                  >
                    {e.role === "admin" ? "Change Role as User" : "Change Role as Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No results message */}
        {searchTerm && filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#999' }}>
            No users found matching "{searchTerm}"
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Users