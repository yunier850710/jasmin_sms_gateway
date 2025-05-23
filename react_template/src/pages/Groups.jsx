import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineRefresh, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi';
import { api } from '../services/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockGroups = [
          {
            id: '1',
            name: 'Administrators',
            description: 'System administrators with full access',
            memberCount: 2,
            permissions: {
              users: ['view', 'create', 'update', 'delete'],
              groups: ['view', 'create', 'update', 'delete'],
              connectors: ['view', 'create', 'update', 'delete'],
              routes: ['view', 'create', 'update', 'delete']
            },
            createdAt: '2023-01-10T10:30:00Z'
          },
          {
            id: '2',
            name: 'Managers',
            description: 'System managers with limited administrative access',
            memberCount: 5,
            permissions: {
              users: ['view', 'create', 'update'],
              groups: ['view'],
              connectors: ['view', 'create', 'update'],
              routes: ['view', 'create', 'update']
            },
            createdAt: '2023-01-12T14:20:00Z'
          },
          {
            id: '3',
            name: 'Users',
            description: 'Regular users with basic permissions',
            memberCount: 12,
            permissions: {
              users: ['view'],
              groups: ['view'],
              connectors: ['view'],
              routes: ['view']
            },
            createdAt: '2023-01-15T09:45:00Z'
          },
          {
            id: '4',
            name: 'API Users',
            description: 'Special group for API integrations',
            memberCount: 3,
            permissions: {
              users: [],
              groups: [],
              connectors: ['view'],
              routes: ['view']
            },
            createdAt: '2023-01-16T11:10:00Z'
          }
        ];
        
        setGroups(mockGroups);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch groups');
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      // In a real implementation, this would call the API
      // For now, we'll just update the UI
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      setShowDeleteConfirm(false);
      setSelectedGroup(null);
    } catch (err) {
      setError('Failed to delete group');
    }
  };

  const confirmDelete = (group) => {
    setSelectedGroup(group);
    setShowDeleteConfirm(true);
  };

  const formatPermissions = (permissions) => {
    const formattedPermissions = [];
    for (const [resource, actions] of Object.entries(permissions)) {
      if (actions.length > 0) {
        formattedPermissions.push(`${resource}: ${actions.join(', ')}`);
      }
    }
    return formattedPermissions.join(' | ');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Group Management</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchGroups} 
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <Link
            to="/groups/create"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HiOutlineUserGroup className="mr-2 h-4 w-4" />
            Add Group
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
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
                {groups.map(group => (
                  <tr key={group.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <HiOutlineUsers className="mr-1 h-4 w-4 text-gray-400" />
                        <span>{group.memberCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {formatPermissions(group.permissions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/groups/members/${group.id}`}
                          className="bg-purple-100 text-purple-700 hover:bg-purple-200 p-1 rounded-md"
                          title="Manage Members"
                        >
                          <HiOutlineUsers className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/groups/edit/${group.id}`}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-1 rounded-md"
                          title="Edit Group"
                        >
                          <HiOutlinePencilAlt className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(group)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 p-1 rounded-md"
                          title="Delete Group"
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
      {showDeleteConfirm && selectedGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Group</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the group "{selectedGroup.name}"? This action cannot be undone.
                </p>
                {selectedGroup.memberCount > 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Warning: This group has {selectedGroup.memberCount} members that will lose these group permissions.
                  </p>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteGroup(selectedGroup.id)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedGroup(null);
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

export default Groups;