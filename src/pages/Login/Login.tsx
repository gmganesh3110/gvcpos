import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import { loginAxios } from "../../services/AxiosService";
import { Link } from "react-router-dom"; // Import Link

type FieldType = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FieldType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResponse: any = await loginAxios("/auth/login", formData);
      const { token, user } = loginResponse.data;

      dispatch(setCredentials({ token, user }));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-600 mb-4 text-sm text-center">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Submit
          </button>

          <p className="mt-4 text-center">New User? Please register</p>
          {/* Link to registration page */}
          <div className="flex justify-center mt-2">
            <Link
              to="/register"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
