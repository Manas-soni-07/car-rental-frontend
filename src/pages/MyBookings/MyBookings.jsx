import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Calendar,
  MapPin,
  XCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Car,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");

      setBookings(res.data.data || []);
    } catch (err) {
      console.log(err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium italic">
            Fetching your trips...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Journeys
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your upcoming and past rentals
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700">
              {bookings.length} Bookings
            </span>
          </div>
        </div>

        {!bookings.length ? (
          <div className="bg-white p-16 rounded-[2.5rem] text-center shadow-sm border border-dashed border-gray-200">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="text-blue-600" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No bookings yet
            </h2>

            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Your upcoming rentals will appear here once you book your first
              ride.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              Start Exploring <ChevronRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
              >
      
                <div className="relative w-full h-60 overflow-hidden">
                  <img
                    src={
                      b.car?.images?.length > 0
                        ? `http://localhost:5000${b.car.images[0]}`
                        : "/images/car-placeholder.jpg"
                    }
                    alt={b.car?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "/images/car-placeholder.jpg";
                    }}
                  />

             
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={b.status} />
                  </div>
                </div>

         
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                      {b.car?.name || "Premium Car"}
                    </h2>

                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-4">
                      {b.car?.brand}
                    </p>

                    {/* Info Box */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        {new Date(b.startDate).toLocaleDateString(
                          "en-GB",
                        )} — {new Date(b.endDate).toLocaleDateString("en-GB")}
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        {b.car?.location || "Main Showroom"}
                      </div>
                    </div>
                  </div>

         
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">
                        Total Price
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{b.totalPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {b.status !== "cancelled" && (
                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        >
                          <XCircle size={20} />
                        </button>
                      )}

                      <Link
                        to={`/car/${b.car?._id}`}
                        className="p-2 bg-black text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-500/90 text-white border-white/20",
    pending: "bg-amber-500/90 text-white border-white/20",
    cancelled: "bg-gray-500/90 text-white border-white/20",
    completed: "bg-blue-500/90 text-white border-white/20",
  };

  const Icons = {
    confirmed: <CheckCircle size={14} />,
    pending: <Clock size={14} />,
    cancelled: <XCircle size={14} />,
    completed: <CheckCircle size={14} />,
  };

  return (
    <span
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${
        styles[status] || styles.pending
      }`}
    >
      {Icons[status] || Icons.pending}
      {status}
    </span>
  );
};

export default MyBookings;
