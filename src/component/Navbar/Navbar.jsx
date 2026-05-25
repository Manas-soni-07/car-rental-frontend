import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Car } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useAuth();

  const logout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
            <Car size={24} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter">
            DRIVE<span className="text-blue-500">X</span>
          </span>
        </Link>

        <div className="flex gap-8 items-center">
          {!user && (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-blue-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-white/5"
              >
                Get Started
              </Link>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-6">
              <Link to="/" className="border-r border-white/20 pr-6">
                Home
              </Link>
              <Link
                to="/search"
                className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
              >
                Search
              </Link>

              {user.role === "user" && (
                <>
                  <Link
                    to="/user/dashboard"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    User Dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {user.role === "host" && (
                <>
                  <Link
                    to="/host/dashboard"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    Host Dashboard
                  </Link>

                  <Link
                    to="/host/add-car"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    Add Car
                  </Link>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition border-r border-white/20 pr-6"
                  >
                    Users
                  </Link>
                </>
              )}

              <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-semibold hidden sm:inline-block">
                  {user.name?.split(" ")[0] || "User"}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut size={18} />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
