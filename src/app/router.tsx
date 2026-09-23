import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CommandCenterLayout } from '../components/layout/CommandCenterLayout';
import { ProtectedRoute } from '../features/auth/guards/ProtectedRoute';

// Lazy loaded EOC page components
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const UnauthorizedPage = lazy(() => import('../features/auth/pages/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage })));
const MapPage = lazy(() => import('../features/map/pages/MapPage').then((m) => ({ default: m.MapPage })));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const IncidentsPage = lazy(() => import('../features/incidents/pages/IncidentsPage').then((m) => ({ default: m.IncidentsPage })));
const MissionsPage = lazy(() => import('../features/missions/pages/MissionsPage').then((m) => ({ default: m.MissionsPage })));
const ResourcesPage = lazy(() => import('../features/resources/pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })));
const VehiclesPage = lazy(() => import('../features/vehicles/pages/VehiclesPage').then((m) => ({ default: m.VehiclesPage })));
const PersonnelPage = lazy(() => import('../features/personnel/pages/PersonnelPage').then((m) => ({ default: m.PersonnelPage })));
const HospitalsPage = lazy(() => import('../features/hospitals/pages/HospitalsPage').then((m) => ({ default: m.HospitalsPage })));
const SheltersPage = lazy(() => import('../features/shelters/pages/SheltersPage').then((m) => ({ default: m.SheltersPage })));
const CommunicationPage = lazy(() => import('../features/communication/pages/CommunicationPage').then((m) => ({ default: m.CommunicationPage })));
const AiCenterPage = lazy(() => import('../features/ai-center/pages/AiCenterPage').then((m) => ({ default: m.AiCenterPage })));
const AnalyticsPage = lazy(() => import('../features/analytics/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage').then((m) => ({ default: m.AdminPage })));

const PageLoader = () => (
  <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#07161E] text-white">
    <div className="w-10 h-10 border-4 border-[#1E3440] border-t-[#00D4FF] rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
      INITIALIZING AEGISX NODE...
    </span>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<PageLoader />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },

  // EOC Command Center Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CommandCenterLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
          { path: '/map', element: <Suspense fallback={<PageLoader />}><MapPage /></Suspense> },
          { path: '/incidents', element: <Suspense fallback={<PageLoader />}><IncidentsPage /></Suspense> },
          { path: '/missions', element: <Suspense fallback={<PageLoader />}><MissionsPage /></Suspense> },
          { path: '/resources', element: <Suspense fallback={<PageLoader />}><ResourcesPage /></Suspense> },
          { path: '/vehicles', element: <Suspense fallback={<PageLoader />}><VehiclesPage /></Suspense> },
          { path: '/personnel', element: <Suspense fallback={<PageLoader />}><PersonnelPage /></Suspense> },
          { path: '/hospitals', element: <Suspense fallback={<PageLoader />}><HospitalsPage /></Suspense> },
          { path: '/shelters', element: <Suspense fallback={<PageLoader />}><SheltersPage /></Suspense> },
          { path: '/communication', element: <Suspense fallback={<PageLoader />}><CommunicationPage /></Suspense> },
          { path: '/ai-center', element: <Suspense fallback={<PageLoader />}><AiCenterPage /></Suspense> },
          { path: '/analytics', element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
          { path: '/reports', element: <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense> },
          { path: '/settings', element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
          { path: '/admin', element: <ProtectedRoute allowedRoles={['Administrator']}><Suspense fallback={<PageLoader />}><AdminPage /></Suspense></ProtectedRoute> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

