
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // If this is a social callback that failed, try to extract any useful info
    if (location.pathname.includes('social-callback') || location.pathname.includes('auth')) {
      console.error("Auth callback params:", location.search);
    }
  }, [location.pathname, location.search]);

  // Check if the path is one of our common routes with a typo
  const suggestedRoute = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes("social-callback") || path.includes("auth/")) {
      return { path: "/dashboard#social", name: "Social Media Dashboard" };
    } else if (path.includes("privacy") || path.includes("policy")) {
      return { path: "/privacy-policy", name: "Privacy Policy" };
    } else if (path.includes("term") || path.includes("service") || path.includes("tos")) {
      return { path: "/terms", name: "Terms of Service" };
    } else if (path.includes("data") || path.includes("delete") || path.includes("deletion")) {
      return { path: "/data-deletion", name: "Data Deletion" };
    }
    
    return null;
  };
  
  const suggestion = suggestedRoute();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-skilllink-green mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-6">Page not found</p>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been removed, 
            had its name changed, or is temporarily unavailable.
          </p>
          
          {suggestion && (
            <div className="mb-8 p-4 bg-skilllink-green/10 rounded-lg">
              <p className="text-gray-700 mb-2">Were you looking for:</p>
              <Link 
                to={suggestion.path} 
                className="text-skilllink-green font-medium hover:underline"
              >
                {suggestion.name}
              </Link>
            </div>
          )}
          
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full bg-skilllink-green text-white py-3 px-4 rounded-md hover:bg-skilllink-dark-green transition-colors"
            >
              Go back to homepage
            </Link>
            <Link
              to="/dashboard#social"
              className="block w-full border border-skilllink-green text-skilllink-green py-3 px-4 rounded-md hover:bg-skilllink-green/10 transition-colors"
            >
              Go to Social Media Dashboard
            </Link>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/privacy-policy"
                className="bg-white text-skilllink-green border border-skilllink-green py-2 px-4 rounded-md hover:bg-skilllink-green/10 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="bg-white text-skilllink-green border border-skilllink-green py-2 px-4 rounded-md hover:bg-skilllink-green/10 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
