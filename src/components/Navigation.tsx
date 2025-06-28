import { Link } from "react-router-dom";
import { Heart, Database, LogOut, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  session: any;
  handleLogout: () => void;
  setShowQuestionnaire: (show: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  session,
  handleLogout,
  setShowQuestionnaire,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        Home
      </Link>
      <Link
        to="/about"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        About
      </Link>
      <Link
        to="/treatments"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        Treatments
      </Link>
      <Link
        to="/how-it-works"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        How It Works
      </Link>
      <Link
        to="/consultation"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        Consultation
      </Link>
      <Link
        to="/blog"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        Blog
      </Link>
      <Link
        to="/contact"
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
        onClick={closeMobileMenu}
      >
        Contact
      </Link>
      {session && (
        <>
          <Link
            to="/admin"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 flex items-center"
            onClick={closeMobileMenu}
          >
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Assessment Data</span>
            <span className="lg:hidden">Data</span>
          </Link>
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart
                className="h-8 w-8 text-primary animate-pulse"
                strokeWidth={2}
              />
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold text-primary">QurePlus</span>
                <span className="text-xs text-primary-dark">
                  Your Surgery Buddy
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0.5">
            <NavLinks />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {!session && (
              <button
                onClick={() => setShowQuestionnaire(true)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
              >
                <span className="hidden sm:inline">Start Assessment</span>
                <span className="sm:hidden">Assessment</span>
                <ArrowRight className="hidden sm:inline ml-2 h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Assessment Button */}
          {!session && (
            <div className="hidden lg:block">
              <button
                onClick={() => setShowQuestionnaire(true)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
              >
                <span className="hidden lg:inline">Start Free Assessment</span>
                <span className="lg:hidden">Start Assessment</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <div className="flex flex-col">
            <NavLinks />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
