import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { MapPin, Fuel, Armchair, ArrowRight } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import car1 from "../../assets/car1.jpg";
import car2 from "../../assets/car2.jpg";
import car3 from "../../assets/car3.jpg";

function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCar();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCar = async () => {
    try {
      const response = await API.get("/cars/all-cars");
      setCars(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Carousel
            autoPlay
            infiniteLoop
            interval={4000}
            transitionTime={1000}
            stopOnHover={false}
          >
            <div>
              <img src={car1} alt="Car 1" className="h-[85vh] object-cover" />
            </div>

            <div>
              <img src={car2} alt="Car 2" className="h-[85vh] object-cover" />
            </div>

            <div>
              <img src={car3} alt="Car 3" className="h-[85vh] object-cover" />
            </div>
          </Carousel>

          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Premium Mobility. <br />
            <span className="text-blue-500">Absolute Freedom.</span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl">
            Experience the thrill of the open road with our handpicked
            collection of luxury and performance vehicles.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
            <div className="px-3">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Featured Fleet
              </h2>
              <p className="text-gray-500 mt-3 text-lg">
                The best deals for your next journey
              </p>
            </div>

            <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all duration-300">
              View All <ArrowRight size={18} />
            </button>
          </div>

          <div className=" max-w-[1400px] px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:5000${car.images[0]}`}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition duration-500"></div>

                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/30 shadow-lg">
                    ₹ {car.pricePerDay} / day
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {car.name}
                    </h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">
                      {car.brand}
                    </p>
                  </div>

                  <div className="flex justify-between items-center py-4 border-y border-gray-100 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Armchair size={16} className="text-blue-500" />
                      <span>{car.seatingCapacity} </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Fuel size={16} className="text-blue-500" />
                      <span>Petrol</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  {user?.role !== "host" ? (
                    <Link to={`/car/${car._id}`}>
                      <button className="mt-6 w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-xl font-bold tracking-wide hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-200">
                        Book Now
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-6 w-full bg-gray-300 text-gray-600 py-4 rounded-xl font-bold tracking-wide cursor-not-allowed"
                    >
                      Hosts Cannot Book
                    </button>
                  )}

                  {/*  */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
