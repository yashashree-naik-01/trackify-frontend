import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Track from './pages/Track';
import TrackingResult from './pages/TrackingResult';
import Layout from './components/Layout';
import History from './pages/dashboards/History';
import Settings from './pages/dashboards/Settings';
import VendorDashboard from './pages/dashboards/VendorDashboard';
import VendorUpdateStatus from './pages/dashboards/VendorUpdateStatus';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import UserList from './pages/dashboards/UserList';
import VendorServiceCenters from './pages/dashboards/VendorServiceCenters';
import SendJobRequest from './pages/SendJobRequest';
import RegisterServiceCenter from './pages/RegisterServiceCenter';
import ServiceCenterDashboard from './pages/dashboards/ServiceCenterDashboard';
import ServiceCenterUpdateStatus from './pages/dashboards/ServiceCenterUpdateStatus';
import JobRequests from './pages/dashboards/JobRequests';
import VendorRequests from './pages/dashboards/VendorRequests';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tracking-result" element={<TrackingResult />} />
            <Route path="/track/:ticketId" element={<Track />} />
            <Route path="/register/service-center" element={<RegisterServiceCenter />} />
            <Route path="/dashboard/service-center" element={
              <ProtectedRoute allowedRoles={['Service']}>
                <ServiceCenterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/service-center/requests" element={
              <ProtectedRoute allowedRoles={['Service']}>
                <JobRequests />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/service-center/update-status" element={
              <ProtectedRoute allowedRoles={['Service']}>
                <ServiceCenterUpdateStatus />
              </ProtectedRoute>
            } />

            <Route
              path="/dashboard/vendor"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/history"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <History role="Vendor" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/update-status"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <VendorUpdateStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/requests"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <VendorRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/settings"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <Settings role="Vendor" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/marketplace"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <VendorServiceCenters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor/request-job/:serviceCenterId"
              element={
                <ProtectedRoute allowedRoles={['Vendor']}>
                  <SendJobRequest />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/service-center/history"
              element={
                <ProtectedRoute allowedRoles={['Service']}>
                  <History role="Service" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/service-center/settings"
              element={
                <ProtectedRoute allowedRoles={['Service']}>
                  <Settings role="Service" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/vendors"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserList role="Vendor" title="Vendors" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/service-centers"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserList role="Service" title="Service Centers" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Settings role="Admin" />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
