import React, { useState } from "react";
import API from "../../services/api";
import {
  Car,
  Upload,
  IndianRupee,
  MapPin,
  Users,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";

export default function HostAddCar() {
  const [carData, setCarData] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    location: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setCarData({ ...carData, image: e.target.files[0].name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(carData).forEach((key) => formData.append(key, carData[key]));
    formData.append("image", image);

    try {
      await API.post("/cars/add-car", formData);
      toast("Car Listed Successfully! 🚀");
      setCarData({
        name: "",
        brand: "",
        pricePerDay: "",
        fuelType: "Petrol",
        transmission: "Manual",
        seatingCapacity: 5,
        location: "",
      });
    } catch (err) {
      toast("Error adding car");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-black p-3 rounded-2xl shadow-xl">
            <Car className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            List Your Car
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          {/* Left Side: Upload Section */}
          <div className="space-y-6">
            <div className="group relative border-2 border-dashed border-gray-200 rounded-[2rem] h-64 flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 transition-all">
              {preview ? (
                <img
                  src={preview}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-gray-300 mb-2" size={48} />
                  <p className="text-gray-400 font-medium">Upload Car Photo</p>
                </div>
              )}
              <input
                type="file"
                value={carData.file}
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">
                Car Details
              </label>
              <input
                name="name"
                value={carData.name}
                placeholder="Car Model (e.g. Thar)"
                onChange={(e) =>
                  setCarData({ ...carData, name: e.target.value })
                }
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                name="brand"
                value={carData.brand}
                placeholder="Brand (e.g. Mahindra)"
                onChange={(e) =>
                  setCarData({ ...carData, brand: e.target.value })
                }
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <IndianRupee
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />
              <input
                type="number"
                value={carData.pricePerDay}
                placeholder="Price Per Day"
                onChange={(e) =>
                  setCarData({ ...carData, pricePerDay: e.target.value })
                }
                className="w-full pl-12 p-4 bg-gray-50 rounded-2xl outline-none"
                required
              />
            </div>

            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />
              <input
                placeholder="Location"
                value={carData.location}
                onChange={(e) =>
                  setCarData({ ...carData, location: e.target.value })
                }
                className="w-full pl-12 p-4 bg-gray-50 rounded-2xl outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                onChange={(e) =>
                  setCarData({ ...carData, fuelType: e.target.value })
                }
                className="p-4 bg-gray-50 rounded-2xl outline-none"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
              </select>
              <select
                onChange={(e) =>
                  setCarData({ ...carData, transmission: e.target.value })
                }
                className="p-4 bg-gray-50 rounded-2xl outline-none"
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
              <Users className="text-gray-400" size={20} />
              <span className="text-gray-600 font-medium text-sm">Seats:</span>
              <input
                type="number"
                value={carData.seatingCapacity}
                defaultValue="5"
                onChange={(e) =>
                  setCarData({ ...carData, seatingCapacity: e.target.value })
                }
                className="bg-transparent w-full outline-none font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100 mt-4 flex items-center justify-center gap-2"
            >
              <Upload size={20} /> List Car Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
