import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-6xl text-rose-intense font-light mb-4">404</h1>
        <p className="text-gray-400 mb-8">Esta página no existe.</p>
        <Link
          to="/"
          className="text-rose-300 hover:text-rose-200 transition-colors underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
