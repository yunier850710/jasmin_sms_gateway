import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import Groups from './pages/Groups';
import Connectors from './pages/Connectors';
import RoutesList from './pages/Routes';
import Statistics from './pages/Statistics';
import UserForm from './components/forms/UserForm';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout Component
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/edit/:id" element={<UserForm isEdit={true} />} />
              <Route path="groups" element={<Groups />} />
              <Route path="connectors" element={<Connectors />} />
              <Route path="routes" element={<RoutesList />} />
              <Route path="statistics/:section?" element={<Statistics />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;