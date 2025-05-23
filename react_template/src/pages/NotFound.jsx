import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineExclamationCircle } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 py-12">
      <div className="bg-white shadow rounded-lg p-8 max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <HiOutlineExclamationCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <HiOutlineHome className="mr-2 h-5 w-5" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;