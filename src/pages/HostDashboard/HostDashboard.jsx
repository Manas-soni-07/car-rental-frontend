import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./HostDashBoard.css";
import { toast } from "react-toastify";
import { buildAssetUrl } from "../../utils/config";

export default function HostDashBoard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});

  async function fetchData() {
    try {
      const dashboardRes = await API.get("/host/dashboard");
      const dashboard = dashboardRes.data.data || {};

      setCars(dashboard.cars || []);
      setBookings(dashboard.bookings || []);
      setStats(dashboard.stats || {});
    } catch {
      toast.error("Dashboard data load nahi ho pa raha hai.");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, bookingStatus) => {
    try {
      await API.put(`/bookings/update-status/${id}`, {
        bookingId: id,
        bookingStatus,
      });

      toast.success(`Booking ${bookingStatus}`);
      fetchData();
    } catch {
      toast.error("Booking status update nahi ho pa raha hai.");
    }
  };

  const startRide = async (id) => {
    try {
      await API.put(`/bookings/start-ride/${id}`);
      toast.success("Ride started");
      fetchData();
    } catch {
      toast.error("Ride start nahi ho pa rahi hai.");
    }
  };

  const completeRide = async (id) => {
    try {
      await API.put(`/bookings/complete-ride/${id}`);
      toast.success("Ride completed");
      fetchData();
    } catch {
      toast.error("Ride complete nahi ho pa rahi hai.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await API.delete(`/cars/deletebyhost/${id}`);
      toast.success("Car deleted successfully");
      fetchData();
    } catch {
      toast.error("Error deleting car");
    }
  };

  const toggleAvailability = async (car) => {
    try {
      await API.put(`/cars/updatebyhost/${car._id}`, {
        isAvailable: !car.isAvailable,
      });
      toast.success(car.isAvailable ? "Listing paused" : "Listing resumed");
      fetchData();
    } catch {
      toast.error("Listing availability update nahi ho pa rahi hai.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Host Dashboard</h1>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p>{stats.totalCars ?? cars.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings ?? bookings.length}</p>
        </div>

        <div className="stat-card">
          <h3>Upcoming Rides</h3>
          <p>{stats.upcomingRides ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Ongoing Rides</h3>
          <p>{stats.ongoingRides ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Rides</h3>
          <p>{stats.completedRides ?? 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p>Rs. {(stats.totalEarnings ?? 0).toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Earnings</h3>
          <p>Rs. {(stats.pendingEarnings ?? 0).toLocaleString()}</p>
        </div>

        <div className="stat-card">
          <h3>Released Earnings</h3>
          <p>Rs. {(stats.releasedEarnings ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <h2>My Cars</h2>
      <div className="grid">
        {cars.map((car) => (
          <div key={car._id} className="card">
            <img src={buildAssetUrl(car.images?.[0])} alt={car.name} />
            <h3>{car.name}</h3>
            <p>{car.brand}</p>
            <p>Rs. {car.pricePerDay} / day</p>
            <p>{car.location}</p>
            <p>{car.city || "City not set"}</p>
            <p>{car.seatingCapacity} Seater</p>
            <p>{car.isAvailable === false ? "Paused" : "Available"}</p>
            <button type="button" onClick={() => toggleAvailability(car)}>
              {car.isAvailable === false ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={() => handleDelete(car._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2>Booking Requests</h2>
      <div>
        {bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <div>
              <h4>{b.car?.name}</h4>
              <p>User: {b.user?.name}</p>
              <p>
                {new Date(b.startDate).toDateString()} -{" "}
                {new Date(b.endDate).toDateString()}
              </p>
              <p>Contact : {b.phoneNumber}</p>
              <p>Booking Total: Rs. {(b.totalAmount || b.totalPrice || 0).toLocaleString()}</p>
              <p>Host Earning: Rs. {(b.hostEarning || 0).toLocaleString()}</p>
              <p>Platform Commission: Rs. {(b.platformCommission || 0).toLocaleString()}</p>

              <div className="status-row">
                <span className={`status ${b.bookingStatus || b.status}`}>
                  Booking: {b.bookingStatus || b.status}
                </span>
                <span className={`status ${b.rideStatus || "upcoming"}`}>
                  Ride: {b.rideStatus || "upcoming"}
                </span>
                <span className={`status ${b.paymentStatus || "unpaid"}`}>
                  Payment: {b.paymentStatus || "unpaid"}
                </span>
              </div>
            </div>

            <div className="booking-actions">
              {(b.bookingStatus || b.status) === "pending" && (
                <>
                <button
                  type="button"
                  className="confirm"
                  onClick={() => updateStatus(b._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  type="button"
                  className="reject"
                  onClick={() => updateStatus(b._id, "rejected")}
                >
                  Reject
                </button>
                </>
              )}

              {(b.bookingStatus || b.status) === "accepted" &&
                (b.rideStatus || "upcoming") === "upcoming" && (
                  <button
                    type="button"
                    className="confirm"
                    onClick={() => startRide(b._id)}
                  >
                    Start Ride
                  </button>
                )}

              {b.rideStatus === "ongoing" && (
                <button
                  type="button"
                  className="confirm"
                  onClick={() => completeRide(b._id)}
                >
                  Complete Ride
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
