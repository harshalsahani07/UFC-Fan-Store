import { useEffect, useState } from "react";
import api from "../api/client";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/mine").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>
      {orders.map((order) => (
        <div key={order._id} className="border rounded p-3 mb-3">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
