import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./component/Navbar/Navbar";
import { useAuth } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const CarDetails = lazy(() => import("./pages/CarDetails/CarDetails"));
const SearchPage = lazy(() => import("./pages/Search/Search"));
const MyBookings = lazy(() => import("./pages/MyBookings/MyBookings"));
const HostAddCar = lazy(() => import("./pages/HostDashBoard/HostAddCar"));
const UserDashboard = lazy(() => import("./pages/UserDashboard/UserDashboard"));
const HostDashboard = lazy(() => import("./pages/HostDashBoard/HostDashBoard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminDashboard/AdminUsers"));
const AdminHosts = lazy(() => import("./pages/AdminDashboard/AdminHosts"));
const AdminCars = lazy(() => import("./pages/AdminDashboard/AdminCars"));
const AdminBookings = lazy(() => import("./pages/AdminDashboard/AdminBookings"));
const AdminRevenue = lazy(() => import("./pages/AdminDashboard/AdminRevenue"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-600" />
    </div>
  );
}

function RequireAuth({ children, roles }) {
  const location = useLocation();
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <main className="pt-15 md:pt-15">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/car/:id"
              element={
                <RequireAuth roles={["user"]}>
                  <CarDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <RequireAuth roles={["user"]}>
                  <MyBookings />
                </RequireAuth>
              }
            />
            <Route
              path="/host/add-car"
              element={
                <RequireAuth roles={["host"]}>
                  <HostAddCar />
                </RequireAuth>
              }
            />
            <Route
              path="/host/dashboard"
              element={
                <RequireAuth roles={["host"]}>
                  <HostDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <RequireAuth roles={["user"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminUsers />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/hosts"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminHosts />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cars"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminCars />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminBookings />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/revenue"
              element={
                <RequireAuth roles={["admin"]}>
                  <AdminRevenue />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
