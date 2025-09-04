import React, { useState } from "react";
import { postAxios } from "../../services/AxiosService";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const RestaurantRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const User = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  // File upload preview
  const handleUploadLogo = async (file: File) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res: any = await postAxios("/s3/image", formData, {
        "Content-Type": "multipart/form-data",
      });
      setLogo(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  // File upload preview
  const handleUploadBanner = async (file: File) => {
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res: any = await postAxios("/s3/image", formData, {
        "Content-Type": "multipart/form-data",
      });
      setBanner(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name,
        description,
        city,
        state,
        country,
        address,
        phone,
        email,
        website,
        logo,
        banner,
        createdBy: User.id,
      };

      const res:any = await postAxios("/restuarent", payload);

      if (res?.data?.[0]?.[0]?.restuarentId) {
        const restuarentId = res.data[0][0].restuarentId;

        dispatch(
          setCredentials({
            token: localStorage.getItem('token')!, // keep existing token
            user: {
              ...User,
              restuarent: restuarentId,
              isRegistered: 1,
            },
          })
        );
        navigate('/subscription');
      } else {
        console.error("Restaurant ID not found in response", res.data);
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[95%] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="font-semibold text-xl">Restaurant Registration</h3>
          <button className="text-gray-500 hover:text-black cursor-pointer text-2xl">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-8 bg-gray-50 rounded-b-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Name*
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Restaurant Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter State"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter Country"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter Website URL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="mb-6 text-left">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Upload Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadLogo(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
         file:rounded-lg file:border-0 file:text-sm file:font-semibold 
         file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              {logo && (
                <div className="mt-4">
                  <img
                    src={logo}
                    alt="Logo Preview"
                    className="w-32 h-32 object-cover rounded-lg border shadow"
                  />
                </div>
              )}
            </div>

            {/* Banner Upload */}
            <div className="mb-6 text-left">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Upload Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadBanner(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 
         file:rounded-lg file:border-0 file:text-sm file:font-semibold 
         file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              {banner && (
                <div className="mt-4">
                  <img
                    src={banner}
                    alt="Banner Preview"
                    className="w-full max-h-48 object-cover rounded-lg border shadow"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;
