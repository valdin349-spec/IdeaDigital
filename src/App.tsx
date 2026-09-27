import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Fix universal: agarra default o named
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then((m: any) => ({ default: m.default || m.AdminLogin })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m: any) => ({ default: m.default || m.AdminDashboard })));
const AdminEditor = lazy(() => import('@/pages/AdminEditor').then((m: any) => ({ default: m.default || m.AdminEditor })));
const AdminPreview = lazy(() => import('@/pages/AdminPreview').then((m: any) => ({ default: m.default || m.AdminPreview })));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage').then((m: any) => ({ default: m.default || m.ExperiencePage })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m: any) => ({ default: m.default || m.NotFound })));

function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-pink-500/30 border-t-pink-500 animate-spin" />
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
