import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { MapPin, Fuel, Users, Gauge, Calendar, ChevronLeft, CreditCard } from "lucide-react";
import { toast } from "react-toastify";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    return diff >= 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1 : 0;
  };

  const days = calculateDays();
  const totalPrice = car ? days * car.pricePerDay : 0;

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await API.get(`/cars/${id}`);
      setCar(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) return toast("Please select your rental dates.");
    if (days <= 0) return toast("End date must be after start date.");

    setLoading(true);
    try {
      await API.post("/bookings/create", {
        carId: car._id,
        startDate,
        endDate,
        totalPrice,
      });
      toast("Booking successful 🎉");
      navigate("/my-bookings");
    } catch (err) {
      toast("There is already a booking on this date.Please Select another date");
    } finally {
      setLoading(false);
    }
  };

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );
return (
  <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen pt-24 pb-16 px-4 md:px-8">
    <div className="max-w-7xl mx-auto">

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-8 group font-medium"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Fleet
      </button>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={`http://localhost:5000${car.images[0]}`}
              alt={car.name}
              className="w-full h-[450px] object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-extrabold drop-shadow-lg">{car.name}</h1>
              <p className="uppercase tracking-widest text-blue-300 font-semibold">{car.brand}</p>
            </div>
          </div>

          {/* Car Info Card */}
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-100">

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl hover:shadow-lg transition">
                <Gauge className="text-blue-600 mb-2" size={26} />
                <span className="text-xs text-gray-400 uppercase font-bold">Transmission</span>
                <span className="font-semibold">{car.transmission}</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl hover:shadow-lg transition">
                <Fuel className="text-blue-600 mb-2" size={26} />
                <span className="text-xs text-gray-400 uppercase font-bold">Fuel</span>
                <span className="font-semibold">{car.fuelType}</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl hover:shadow-lg transition">
                <Users className="text-blue-600 mb-2" size={26} />
                <span className="text-xs text-gray-400 uppercase font-bold">Capacity</span>
                <span className="font-semibold">{car.seatingCapacity} Seats</span>
              </div>

              <div className="flex flex-col items-center p-5 bg-gray-50 rounded-2xl hover:shadow-lg transition">
                <MapPin className="text-blue-600 mb-2" size={26} />
                <span className="text-xs text-gray-400 uppercase font-bold">Location</span>
                <span className="font-semibold">{car.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">About this car</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Enjoy a premium driving experience with the {car.name}. 
                Perfect for city rides and long road trips in {car.location}. 
                Includes insurance, sanitized interiors, and 24/7 support.
              </p>
            </div>

          </div>
        </div>


        {/* RIGHT SIDE BOOKING CARD */}
        <div>
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-200 sticky top-28">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-600" />
                Book Now
              </h3>
              <div>
                <p className="text-3xl font-bold">₹{car.pricePerDay}</p>
                <span className="text-gray-400 text-sm">per day</span>
              </div>
            </div>

            {/* Date Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Pick-up Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Return Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Price Breakdown */}
            {days > 0 && (
              <div className="mt-8 bg-blue-50 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between">
                  <span>₹{car.pricePerDay} x {days} days</span>
                  <span>₹{car.pricePerDay * days}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₹499</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg text-blue-800">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {loading ? "Processing..." : "Confirm Booking"}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Free cancellation up to 24 hours before pickup.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}
export default CarDetails;