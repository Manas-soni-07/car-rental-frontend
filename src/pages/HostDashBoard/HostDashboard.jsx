import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./HostDashboard.css";
import { toast } from "react-toastify";

export default function HostDashboard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editCar, setEditCar] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const carRes = await API.get("/cars/host/my-cars");
      const bookingRes = await API.get("/bookings/host");

      console.log(carRes.data);
      console.log(bookingRes.data);

      setCars(carRes.data.cars);
      setBookings(bookingRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/update-status/${id}`, {
        bookingId: id,
        status,
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    console.log("delete");

    try {
      await API.delete(`/cars/deletebyhost/${id}`);
      toast("Car deleted successfully");
      fetchData();
    } catch (err) {
      console.log(err);
      toast("Error deleting car");
    }
  };

const updateCar = async (carId, updatedData) => {
  try {
    const { data } = await API.put(`/cars/${carId}`, updatedData);

    if (data.success) {
      toast.success("Car updated successfully ✅");

      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId ? data.data : car
        )
      );

      setEditCar(null); 
    }
  } catch (error) {
    console.error("Update Error:", error);
    toast.error("Error updating car ❌");
  }
};

  // const handleChange = (e) => {
  //   setEditCar({
  //     ...editCar,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCar(editCar._id, editCar);
  };

  const handleEditClick = (car) => {
    setEditCar(car);
  };
  return (
    <div className="dashboard">
      <h1>Host Dashboard</h1>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p>{cars.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue}</p>
        </div>
      </div>

      <h2>My Cars</h2>
      <div className="grid">
        {cars.map((car) => (
          <div key={car._id} className="card">
            <img src={`http://localhost:5000${car.images[0]}`} alt={car.name} />
            <h3>{car.name}</h3>
            <p>{car.brand}</p>
            <p>₹ {car.pricePerDay} / day</p>
            <p>{car.location}</p>
            <p>{car.seatingCapacity} Seater</p>
            <button onClick={() => handleDelete(car._id)}>Delete</button>


            {/* <button onClick={() => handleEditClick(car)}>Edit</button> */}
            {/* {editCar && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Edit Car</h2>

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      value={editCar.name}
                      onChange={handleChange}
                      placeholder="Car Name"
                    />

                    <input
                      type="text"
                      name="brand"
                      value={editCar.brand}
                      onChange={handleChange}
                      placeholder="Brand"
                    />

                    <input
                      type="number"
                      name="pricePerDay"
                      value={editCar.pricePerDay}
                      onChange={handleChange}
                      placeholder="Price"
                    />

                    <div className="modal-buttons">
                      <button type="submit">Update</button>
                      <button type="button" onClick={() => setEditCar(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )} */}
            
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
              <p>₹ {b.totalPrice}</p>

              <span className={`status ${b.status}`}>{b.status}</span>
            </div>

            {b.status === "pending" && (
              <div>
                <button
                  className="confirm"
                  onClick={() => updateStatus(b._id, "confirmed")}
                >
                  Confirm
                </button>

                <button
                  className="reject"
                  onClick={() => updateStatus(b._id, "cancelled")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
