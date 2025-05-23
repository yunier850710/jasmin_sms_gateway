import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUserAdd, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { api } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the api to fetch users
      // For now, we'll use mock data
      setTimeout(() => {
        const mockUsers = [
          {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            roles: ['admin'],
            isActive: true,
            createdAt: '2023-01-10T10:30:00Z',
            groups: ['Administrators']
          },
          {
            id: '2',
            username: 'manager',
            email: 'manager@example.com',
            roles: ['manager'],
            isActive: true,
            createdAt: '2023-01-12T14:20:00Z',
            groups: ['Managers']
          },
          {
            id: '3',
            username: 'user1',
            email: 'user1@example.com',
            roles: ['user'],
            isActive: true,
            createdAt: '2023-01-15T09:45:00Z',
            groups: ['Users']
          },
          {
            id: '4',
            username: 'user2',
            email: 'user2@example.com',
            roles: ['user'],
            isActive: false,
            createdAt: '2023-01-16T11:10:00Z',
            groups: ['Users']
          },
        ];
        
        setUsers(mockUsers);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // In a real implementation, this would call the API to update the user status
      // For now, we'll just update the UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // In a real implementation, this would call the API to delete the user
      // For now, we'll just update the UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchUsers} 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <Link
            to="/users/create"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineUserAdd className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
          <p>{error}</p>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groups
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.groups.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                          className={`${user.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} p-1 rounded-md`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? (
                            <HiOutlineX className="h-5 w-5" />
                          ) : (
                            <HiOutlineCheck className="h-5 w-5" />
                          )}
                        </button>
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-1 rounded-md"
                          title="Edit User"
                        >
                          <HiOutlinePencilAlt className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                          title="Delete User"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the user "{selectedUser.username}"? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedUser(null);
                  }}
                  className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;