import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AdminLogin = lazy(() => import('@/pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminEditor = lazy(() => import('@/pages/AdminEditor').then((m) => ({ default: m.AdminEditor })));
const AdminPreview = lazy(() => import('@/pages/AdminPreview').then((m) => ({ default: m.AdminPreview })));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

function Loading() {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-rose-intense/30 border-t-rose-intense animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:slug"
          element={
            <ProtectedRoute>
              <AdminEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/preview/:slug"
          element={
            <ProtectedRoute>
              <AdminPreview />
            </ProtectedRoute>
          }
        />
        <Route path="/:slug" element={<ExperiencePage />} />
        <Route path="/" element={<Navigate to="/gaby-rosales" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
