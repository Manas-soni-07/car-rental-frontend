import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Fuel, Armchair, ArrowRight, Calendar, Search } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import car1 from "../../assets/car1.jpg";
import car2 from "../../assets/car2.jpg";
import car3 from "../../assets/car3.jpg";
import LocationMap from "../../component/maps/LocationMap";
import { buildAssetUrl } from "../../utils/config";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const [cars, setCars] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [trendingCars, setTrendingCars] = useState([]);
  const [searchForm, setSearchForm] = useState({
    city: "",
    pickupDate: "",
    returnDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get("/cars/all-cars");
        const carsData = response.data?.data || response.data?.cars || response.data;
        setCars(Array.isArray(carsData) ? carsData : []);
        const [citiesRes, trendingRes] = await Promise.all([
          API.get("/cities/popular"),
          API.get("/cars/trending?limit=6"),
        ]);
        setPopularCities(citiesRes.data?.data?.cities || []);
        setTrendingCars(trendingRes.data?.data?.cars || []);
      } catch {
        setError("Cars load nahi ho pa rahi hain. Please backend API check karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const submitHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
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
            showThumbs={false}
            showStatus={false}
          >
            <div>
              <img src={car1} alt="Luxury car on road" className="h-[85vh] object-cover" />
            </div>
            <div>
              <img src={car2} alt="Premium rental car" className="h-[85vh] object-cover" />
            </div>
            <div>
              <img src={car3} alt="Performance car exterior" className="h-[85vh] object-cover" />
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
          <form
            onSubmit={submitHeroSearch}
            className="bg-white rounded-2xl p-3 grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 max-w-5xl shadow-2xl"
          >
            <div className="relative">
              <MapPin className="absolute left-3 top-4 text-gray-400" size={18} />
              <input
                value={searchForm.city}
                onChange={(e) => setSearchForm({ ...searchForm, city: e.target.value })}
                placeholder="Search city"
                className="w-full pl-10 p-4 bg-gray-50 rounded-xl outline-none text-gray-900"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-4 text-gray-400" size={18} />
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={searchForm.pickupDate}
                onChange={(e) => setSearchForm({ ...searchForm, pickupDate: e.target.value })}
                className="w-full pl-10 p-4 bg-gray-50 rounded-xl outline-none text-gray-900"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-4 text-gray-400" size={18} />
              <input
                type="date"
                min={searchForm.pickupDate || new Date().toISOString().split("T")[0]}
                value={searchForm.returnDate}
                onChange={(e) => setSearchForm({ ...searchForm, returnDate: e.target.value })}
                className="w-full pl-10 p-4 bg-gray-50 rounded-xl outline-none text-gray-900"
              />
            </div>
            <button className="bg-blue-600 text-white rounded-xl px-6 font-bold flex items-center justify-center gap-2">
              <Search size={18} /> Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-6">
          {!!popularCities.length && (
            <div className="mb-20">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Popular Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {popularCities.slice(0, 5).map((city) => (
                  <Link
                    key={city.city}
                    to={`/search?city=${encodeURIComponent(city.city)}`}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="text-xl font-black">{city.city}</p>
                    <p className="text-sm text-gray-500">
                      {city.activeListings} cars from Rs. {city.averagePrice}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!trendingCars.length && (
            <div className="mb-20">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Trending Cars
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Popular rentals ranked by trips, ratings and verified hosts
                  </p>
                </div>
                <Link to="/search?sort=popularity" className="text-blue-600 font-bold">
                  View Search
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {trendingCars.slice(0, 3).map((car) => (
                  <Link
                    key={car._id}
                    to={`/car/${car._id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition"
                  >
                    <img src={buildAssetUrl(car.images?.[0])} alt={car.name} className="h-56 w-full object-cover" />
                    <div className="p-5">
                      <h3 className="text-xl font-black">{car.name}</h3>
                      <p className="text-sm text-gray-500">{car.city || car.location}</p>
                      <p className="mt-3 font-bold">Rs. {car.pricePerDay} / day</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
            <div className="px-3">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Featured Fleet
              </h2>
              <p className="text-gray-500 mt-3 text-lg">
                The best deals for your next journey
              </p>
            </div>

            <a
              href="#fleet"
              className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all duration-300"
            >
              View All <ArrowRight size={18} />
            </a>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-600" />
            </div>
          )}

          {error && !loading && (
            <div className="mx-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="mx-3 rounded-xl border border-gray-100 bg-white p-10 text-center text-gray-500">
              No cars available right now.
            </div>
          )}

          <div
            id="fleet"
            className="max-w-[1400px] px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {cars.map((car) => (
              <div
                key={car._id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={buildAssetUrl(car.images?.[0])}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition duration-500"></div>

                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/30 shadow-lg">
                    Rs. {car.pricePerDay} / day
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
                      <span>{car.seatingCapacity}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Fuel size={16} className="text-blue-500" />
                      <span>{car.fuelType || "Petrol"}</span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={16} className="text-blue-500 shrink-0" />
                      <span className="truncate">{car.city || car.location}</span>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LocationMap />
    </div>
  );
}

export default Home;
