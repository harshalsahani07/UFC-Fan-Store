import { useState } from "react";
import api from "../api/client";
import { useApp } from "../context/AppContext";

const CartPage = () => {
  const { cart, setCart } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    try {
      await api.post("/orders", { items: cart, couponCode });
      setCart([]);
      setMessage("Order placed successfully (mock payment complete).");
    } catch (err) {
      setMessage(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Cart</h2>
      {cart.map((item) => (
        <p key={item.productId}>
          {item.name} x {item.quantity} = ${item.price * item.quantity}
        </p>
      ))}
      <p className="mt-2">Subtotal: ${total}</p>
      <input className="border p-2 mt-3 mr-2 text-black" placeholder="Coupon code (optional)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
      <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={checkout}>
        Checkout
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default CartPage;
