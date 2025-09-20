import React, { useState } from "react";
import { useSelector } from "react-redux";
import { postAxios } from "../../services/AxiosService";

const Subscription: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  const [plan, setPlan] = useState<"monthly" | "yearly" | null>(null);
  const [amount, setAmount] = useState(0);

  const handleSelectPlan = (selectedPlan: "monthly" | "yearly") => {
    setPlan(selectedPlan);
    setAmount(selectedPlan === "monthly" ? 699 : 6000);
  };

  const handleSubscribe = async () => {
    if (!plan) return alert("Please select a plan");

    try {
      // 1️⃣ Call backend to generate Razorpay order
      const res: any = await postAxios("/subscription/create", {
        amount,
        planType: plan,
        userId: user.id,
        restuarent: user.restuarent,
      });

      const { orderId, amount: orderAmount, currency } = res.data;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: "GVC",
        description: `Subscription - ${plan}`,
        order_id: res.data.orderToken,
        handler: async function (response: any) {
          const verifyRes:any = await postAxios("/subscription/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            razorpay_amount: orderAmount,
            orderId: orderId,
            });
          if (verifyRes.data.success) {
            window.location.href = "/payment-success";
          } else {
            window.location.href = "/payment-failed";
          }
        },
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
          contact: user.mobileNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay subscription error:", err);
      alert("Failed to initiate payment. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => handleSelectPlan("monthly")}
            className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
              plan === "monthly"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:shadow-md hover:bg-gray-50"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Monthly</h2>
            <p className="text-gray-700 text-lg mb-4">₹699 / month</p>
            <p className="text-gray-500 text-sm">
              Billed monthly. Cancel anytime.
            </p>
          </div>

          <div
            onClick={() => handleSelectPlan("yearly")}
            className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
              plan === "yearly"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:shadow-md hover:bg-gray-50"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Yearly</h2>
            <p className="text-gray-700 text-lg mb-4">₹6000 / year</p>
            <p className="text-gray-500 text-sm">
              Save more with annual billing.
            </p>
          </div>
        </div>

        {plan && (
          <div className="mb-8 p-6 border rounded-xl bg-gray-50 text-center">
            <p className="text-gray-700">
              Selected Plan: <span className="font-semibold">{plan}</span>
            </p>
            <p className="text-gray-700 mt-2">
              Amount to Pay:{" "}
              <span className="font-bold text-lg">₹{amount}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleSubscribe}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default Subscription;
