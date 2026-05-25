import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, Filter, Fuel, MapPin, Search as SearchIcon, Star, Users } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../services/api";
import { buildAssetUrl } from "../../utils/config";

const today = new Date().toISOString().split("T")[0];

const defaultFilters = {
  city: "",
  pickupDate: "",
  returnDate: "",
  minPrice: "",
  maxPrice: "",
  fuelType: "",
  transmission: "",
  seatingCapacity: "",
  rating: "",
  hostVerifiedOnly: false,
  pickupLat: "",
  pickupLng: "",
  radiusKm: "",
  sort: "price-low",
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nextFilters = { ...defaultFilters };
    Object.keys(nextFilters).forEach((key) => {
      if (key === "hostVerifiedOnly") {
        nextFilters[key] = searchParams.get(key) === "true";
      } else {
        nextFilters[key] = searchParams.get(key) || nextFilters[key];
      }
    });
    setFilters(nextFilters);
    fetchCars(nextFilters);
  }, [searchParams]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== false) params.set(key, value);
    });
    return params;
  }, [filters]);

  const fetchCars = async (activeFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== "" && value !== false) params.set(key, value);
      });
      const res = await API.get(`/cars/search?${params.toString()}`);
      setCars(res.data?.data?.cars || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchParams(queryString);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Find a Rental Car</h1>
          <p className="text-gray-500 mt-2">Search by city, date, budget and car preferences.</p>
        </div>

        <form onSubmit={submitSearch} className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="bg-white rounded-2xl border border-gray-100 p-5 h-fit shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Filter size={18} />
              <h2 className="font-black">Filters</h2>
            </div>

            <div className="space-y-4">
              <Input icon={MapPin} placeholder="City" value={filters.city} onChange={(value) => updateFilter("city", value)} />
              <Input icon={Calendar} type="date" min={today} value={filters.pickupDate} onChange={(value) => updateFilter("pickupDate", value)} />
              <Input icon={Calendar} type="date" min={filters.pickupDate || today} value={filters.returnDate} onChange={(value) => updateFilter("returnDate", value)} />
              {/* <div className="grid grid-cols-3 gap-2">
                <input type="number" step="any" placeholder="Pickup lat" value={filters.pickupLat} onChange={(e) => updateFilter("pickupLat", e.target.value)} className="p-3 bg-gray-50 rounded-xl outline-none" />
                <input type="number" step="any" placeholder="Pickup lng" value={filters.pickupLng} onChange={(e) => updateFilter("pickupLng", e.target.value)} className="p-3 bg-gray-50 rounded-xl outline-none" />
                <input type="number" min="1" placeholder="Km" value={filters.radiusKm} onChange={(e) => updateFilter("radiusKm", e.target.value)} className="p-3 bg-gray-50 rounded-xl outline-none" />
              </div> */}

              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="0" placeholder="Min price" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} className="p-3 bg-gray-50 rounded-xl outline-none" />
                <input type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} className="p-3 bg-gray-50 rounded-xl outline-none" />
              </div>

              <select value={filters.fuelType} onChange={(e) => updateFilter("fuelType", e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none">
                <option value="">Any fuel</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>CNG</option>
              </select>

              <select value={filters.transmission} onChange={(e) => updateFilter("transmission", e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none">
                <option value="">Any transmission</option>
                <option>Manual</option>
                <option>Automatic</option>
              </select>

              <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none">
                <option value="price-low">Price low-high</option>
                <option value="price-high">Price high-low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
                <option value="popularity">Popularity</option>
              </select>

              <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <input type="checkbox" checked={filters.hostVerifiedOnly} onChange={(e) => updateFilter("hostVerifiedOnly", e.target.checked)} />
                Verified hosts only
              </label>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                <SearchIcon size={18} /> Search
              </button>
            </div>
          </aside>

          <section>
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : cars.length ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => <CarCard key={car._id} car={car} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-500">
                No available cars match your search.
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
}

function Input({ icon: Icon, value, onChange, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 rounded-xl outline-none" {...props} />
    </div>
  );
}

function CarCard({ car }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <img src={buildAssetUrl(car.images?.[0])} alt={car.name} className="h-52 w-full object-cover" />
      <div className="p-5">
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{car.name}</h3>
            <p className="text-sm text-blue-600 font-bold">{car.brand}</p>
          </div>
          <div className="text-right">
            <p className="font-black">Rs. {car.pricePerDay}</p>
            <p className="text-xs text-gray-400">per day</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 my-4">
          <span className="flex items-center gap-1"><MapPin size={14} />{car.city || car.location}</span>
          <span className="flex items-center gap-1"><Fuel size={14} />{car.fuelType}</span>
          <span className="flex items-center gap-1"><Users size={14} />{car.seatingCapacity} seats</span>
          <span className="flex items-center gap-1"><Star size={14} />{car.ratingAverage || 0}</span>
        </div>
        <Link to={`/car/${car._id}`} className="block text-center bg-black text-white py-3 rounded-xl font-bold hover:bg-blue-600">
          View Details
        </Link>
      </div>
    </div>
  );
}
