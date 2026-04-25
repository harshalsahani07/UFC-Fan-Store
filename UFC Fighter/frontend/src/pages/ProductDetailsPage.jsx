import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useApp } from "../context/AppContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { addToCart } = useApp();

  const fetchDetails = () => api.get(`/products/${id}`).then((res) => setData(res.data));

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const submitReview = async () => {
    await api.post(`/products/${id}/reviews`, { rating: Number(rating), comment });
    setComment("");
    fetchDetails();
  };

  if (!data) return <div className="p-6">Loading...</div>;
  return (
    <div className="container-app py-6">
      <div className="grid lg:grid-cols-[1fr,340px] gap-6">
        <div className="grid md:grid-cols-2 gap-6 card-ecom p-4">
        <img src={data.product.imageUrl} alt={data.product.name} className="rounded-lg w-full h-80 object-cover" />
        <div>
          <h2 className="text-3xl font-bold">{data.product.name}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{data.product.category}</p>
          <p className="my-3">{data.product.description}</p>
          <p className="text-2xl font-bold mb-2">${data.product.price}</p>
          <p className="mb-2">Average rating: {data.avgRating} / 5</p>
          <div className="my-3">
            <input className="border p-2 mr-2 rounded text-black" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
            <input className="border p-2 mr-2 rounded text-black" placeholder="Review comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={submitReview}>
              Submit Review
            </button>
          </div>
        </div>
        </div>

        <aside className="card-ecom p-4 h-fit">
          <p className="text-2xl font-bold mb-2">${data.product.price}</p>
          <p className="text-sm text-green-600 font-semibold mb-2">In Stock - Fast Dispatch</p>
          <div className="text-sm space-y-1 mb-3">
            <p>Free delivery in 3-5 days</p>
            <p>10-day easy return</p>
            <p>Secure mock checkout</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Top Deal</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">UFC Fan Favorite</span>
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs">Limited Stock</span>
          </div>
          <button
            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg font-semibold"
            onClick={() => addToCart(data.product)}
          >
            Add to Cart
          </button>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
