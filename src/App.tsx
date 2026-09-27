import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminEditor = lazy(() => import('@/pages/AdminEditor'));
const AdminPreview = lazy(() => import('@/pages/AdminPreview'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
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
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/edit/:slug" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
        <Route path="/admin/preview/:slug" element={<ProtectedRoute><AdminPreview /></ProtectedRoute>} />
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
