import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineIdentification,
  HiOutlineExclamation,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserGroup
} from 'react-icons/hi';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { api } from '../../services/api';
import { USER_ROLES } from '../../utils/constants';

const UserForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [USER_ROLES.USER],
    isActive: true,
    groupIds: []
  });

  useEffect(() => {
    // Fetch available groups
    const fetchGroups = async () => {
      try {
        // In a real implementation, this would call the API
        // For mock data, we'll use a setTimeout
        setTimeout(() => {
          const mockGroups = [
            { id: '1', name: 'Administrators' },
            { id: '2', name: 'Managers' },
            { id: '3', name: 'Users' },
            { id: '4', name: 'API Users' }
          ];
          setGroups(mockGroups);
        }, 300);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    fetchGroups();

    // If editing, fetch user details
    const fetchUserDetails = async () => {
      if (!isEdit) return;
      
      try {
        setLoading(true);
        
        // In a real implementation, this would call the API
        // For now, use mock data
        setTimeout(() => {
          if (id === '1') {
            setFormData({
              username: 'admin',
              email: 'admin@example.com',
              password: '', // Empty for security
              confirmPassword: '',
              roles: [USER_ROLES.ADMIN],
              isActive: true,
              groupIds: ['1'] // Admin group
            });
          } else if (id === '2') {
            setFormData({
              username: 'manager',
              email: 'manager@example.com',
              password: '', // Empty for security
              confirmPassword: '',
              roles: [USER_ROLES.MANAGER],
              isActive: true,
              groupIds: ['2'] // Manager group
            });
          } else {
            setError('User not found');
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(`Failed to fetch user details: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => {
      if (prev.roles.includes(role)) {
        return {
          ...prev,
          roles: prev.roles.filter(r => r !== role)
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, role]
        };
      }
    });
  };

  const handleGroupChange = (groupId) => {
    setFormData(prev => {
      if (prev.groupIds.includes(groupId)) {
        return {
          ...prev,
          groupIds: prev.groupIds.filter(id => id !== groupId)
        };
      } else {
        return {
          ...prev,
          groupIds: [...prev.groupIds, groupId]
        };
      }
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!isEdit && !formData.password.trim()) errors.password = 'Password is required';
    if (!isEdit && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (formData.roles.length === 0) errors.roles = 'At least one role must be selected';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join('. ');
      setError(errorMessage);
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      if (isEdit) {
        // In a real implementation, this would call the API
        // await api.updateUser(id, formData);
        console.log('Updating user:', id, formData);
      } else {
        // In a real implementation, this would call the API
        // await api.createUser(formData);
        console.log('Creating new user:', formData);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/users');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} user: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (label, name, type = 'text', icon, placeholder = '', tooltip = '') => {
    return (
      <div className="col-span-6 sm:col-span-3">
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
          {tooltip && (
            <div className="group relative ml-2">
              <HiOutlineQuestionMarkCircle className="h-4 w-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                {tooltip}
              </div>
            </div>
          )}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          {type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={formData[name]}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">{placeholder}</span>
            </div>
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`${icon ? 'pl-10' : 'pl-3'} block w-full pr-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="pb-5 border-b border-gray-200 mb-5">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit User' : 'Add New User'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiOutlineExclamation className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-6 gap-6">
            {/* Basic Information */}
            <div className="col-span-6">
              <h2 className="text-lg font-medium text-gray-900">User Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Basic account information for the user.
              </p>
            </div>
            
            {renderField(
              'Username', 
              'username', 
              'text', 
              <HiOutlineUser className="h-5 w-5 text-gray-400" />, 
              'Enter a unique username'
            )}
            
            {renderField(
              'Email', 
              'email', 
              'email', 
              <HiOutlineMail className="h-5 w-5 text-gray-400" />, 
              'user@example.com'
            )}
            
            {renderField(
              'Password', 
              'password', 
              'password', 
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />, 
              isEdit ? 'Leave blank to keep current password' : 'Enter a secure password'
            )}
            
            {renderField(
              'Confirm Password', 
              'confirmPassword', 
              'password', 
              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />, 
              'Confirm your password'
            )}
            
            {renderField(
              'Active', 
              'isActive', 
              'checkbox', 
              null, 
              'User can log in and perform actions',
              'Inactive users cannot log in to the system'
            )}
            
            {/* Roles and Permissions */}
            <div className="col-span-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Roles & Permissions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Define what the user can do in the system.
              </p>
            </div>
            
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Roles
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="role-admin"
                    name="roles"
                    type="checkbox"
                    checked={formData.roles.includes(USER_ROLES.ADMIN)}
                    onChange={() => handleRoleChange(USER_ROLES.ADMIN)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-900">
                    Administrator (full access to all features)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-manager"
                    name="roles"
                    type="checkbox"
                    checked={formData.roles.includes(USER_ROLES.MANAGER)}
                    onChange={() => handleRoleChange(USER_ROLES.MANAGER)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-manager" className="ml-2 block text-sm text-gray-900">
                    Manager (can manage users and view statistics)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-user"
                    name="roles"
                    type="checkbox"
                    checked={formData.roles.includes(USER_ROLES.USER)}
                    onChange={() => handleRoleChange(USER_ROLES.USER)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="role-user" className="ml-2 block text-sm text-gray-900">
                    User (basic access)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Groups */}
            <div className="col-span-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900">Groups</h2>
              <p className="mt-1 text-sm text-gray-500">
                Assign the user to specific groups to inherit permissions.
              </p>
              
              <div className="mt-4 space-y-2">
                {groups.length > 0 ? (
                  groups.map(group => (
                    <div key={group.id} className="flex items-center">
                      <input
                        id={`group-${group.id}`}
                        type="checkbox"
                        checked={formData.groupIds.includes(group.id)}
                        onChange={() => handleGroupChange(group.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`group-${group.id}`} className="ml-2 flex items-center text-sm text-gray-900">
                        <HiOutlineUserGroup className="h-5 w-5 text-gray-400 mr-1" />
                        {group.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading groups...</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 space-x-3">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {submitting ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Create User'}</span>
              )}
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default UserForm;