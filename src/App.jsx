import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/layout/Dashboard';
import LoginForm from './components/auth/LoginForm';
import ConnectorList from './features/connector/ConnectorList';
import ConnectorDetail from './features/connector/ConnectorDetail';
import RouteList from './features/route/RouteList';
import RouteForm from './features/route/RouteForm';
import AnalyticsDashboard from './features/dashboard/AnalyticsDashboard';

// Auth guard for protected routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is authenticated when app loads
  useEffect(() => {
    const initializeApp = async () => {
      // Add any initial app logic here (e.g., checking token validity)
      setIsInitialized(true);
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AnalyticsDashboard />} />
              <Route path="connectors" element={<ConnectorList />} />
              <Route path="connectors/:type/:id" element={<ConnectorDetail />} />
              <Route path="routes" element={<RouteList />} />
              <Route path="routes/:type/:id" element={<RouteForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;