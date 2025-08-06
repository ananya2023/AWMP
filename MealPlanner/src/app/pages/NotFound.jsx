import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <h2 className="text-xl text-gray-600 mb-8">
          Oops! Page not found
        </h2>
        <RouterLink
          to="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Return to Home
        </RouterLink>
      </div>
    </div>
  );
};

export default NotFound;
