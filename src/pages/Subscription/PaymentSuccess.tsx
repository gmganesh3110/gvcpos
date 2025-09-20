import { useEffect } from "react";
import { logout } from "../../store/authSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const PaymentSuccess: React.FC = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ useNavigate hook

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("token"); // safer than clear()
      dispatch(logout());
      navigate("/login"); // ✅ redirect programmatically
    }, 5000);
  }, [params, dispatch, navigate]);

  const handleLogin = () => {
    navigate("/login"); // ✅ works on button click too
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4 text-gray-700">Thank you for your subscription.</p>

      <p
        onClick={handleLogin}
        className="mt-4 cursor-pointer text-blue-500 underline"
      >
        Please Login to the software
      </p>
    </div>
  );
};

export default PaymentSuccess;
