import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Wallet,
  Car,
  Clock,
  Calendar,
  MapPin,
  XCircle,
  CheckCircle,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      const data = res.data.data || [];

      setBookings(data);

      const total = data.reduce((sum, b) => sum + b.totalPrice, 0);
      setTotalSpent(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await API.put(`/bookings/cancel/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast("Failed to cancel booking.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <LayoutDashboard className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              User Dashboard
            </h1>
            <p className="text-gray-500">
              Manage your bookings and track spending
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
            <Wallet className="text-green-600" size={32} />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                Total Spent
              </p>
              <p className="text-3xl font-black">
                ₹{totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
            <Car className="text-blue-600" size={32} />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">
                Total Bookings
              </p>
              <p className="text-3xl font-black">{bookings.length}</p>
            </div>
          </div>

          <div className="bg-black p-6 rounded-2xl shadow-xl flex items-center gap-5 text-white">
            <Clock size={32} />
            <div>
              <p className="text-xs uppercase text-gray-400">
                Account Status
              </p>
              <p className="text-2xl font-bold">Verified User</p>
            </div>
          </div>
        </div>

        {/* All Bookings Section */}
        <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>

        {bookings.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl text-center shadow-sm">
            <Car size={40} className="mx-auto text-blue-600 mb-4" />
            <p className="text-gray-500">
              You haven't made any bookings yet.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition"
            >
              Explore Cars <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col"
              >
                <h3 className="text-xl font-bold">
                  {b.car?.name}
                </h3>

                <p className="text-sm text-blue-600 font-semibold mb-4">
                  {b.car?.brand}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(b.startDate).toLocaleDateString()} -{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {b.car?.location || "Main Showroom"}
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <p className="font-black text-lg">
                    ₹{b.totalPrice}
                  </p>

                  <div className="flex gap-3">
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle size={22} />
                      </button>
                    )}

                    <Link
                      to={`/car/${b.car?._id}`}
                      className="text-black hover:text-blue-600"
                    >
                      <ChevronRight size={22} />
                    </Link>
                  </div>
                </div>

                <span className="mt-4 text-xs font-bold uppercase">
                  Status: {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;