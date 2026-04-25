import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useApp();

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  const topDeals = useMemo(
    () => [...products].sort((a, b) => a.price - b.price).slice(0, 8),
    [products]
  );
  const newArrivals = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 8),
    [products]
  );
  const bestSellers = useMemo(
    () => [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 8),
    [products]
  );

  const ProductStrip = ({ title, items }) => (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Link to="/products" className="text-red-500 font-semibold">
          View All
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p._id} className="card-ecom overflow-hidden">
            <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-cover" />
            <div className="p-3">
              <h4 className="font-semibold line-clamp-2 min-h-12">{p.name}</h4>
              <p className="font-bold mt-1">${p.price}</p>
              <button className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg" onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="container-app py-8">
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-black to-red-950 p-8 text-white">
      <h1 className="text-4xl font-extrabold mb-3">UFC Fan Store + Fighter Hub</h1>
      <p className="mb-6 max-w-2xl text-slate-200">
        Discover 50+ UFC-inspired products, explore top all-time fighters, and join the fan community with reviews and ratings.
      </p>
      <div className="flex gap-4">
        <Link className="px-5 py-3 rounded-lg bg-red-600 text-white font-semibold" to="/products">
          Shop Like a Pro
        </Link>
        <Link className="px-5 py-3 rounded-lg bg-slate-100 text-slate-900 font-semibold" to="/fighters">
          Explore Top 10 Fighters
        </Link>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <div className="card-ecom p-5">
        <h3 className="font-bold mb-2">Big Product Catalog</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Apparel, gear, collectibles, and training essentials with pricing and stock.</p>
      </div>
      <div className="card-ecom p-5">
        <h3 className="font-bold mb-2">Fighter Hub</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Detailed fighter profiles with records, bios, fan ratings, and comments.</p>
      </div>
      <div className="card-ecom p-5">
        <h3 className="font-bold mb-2">Admin + Customer Panels</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Role-based experiences with analytics, product management, and user orders.</p>
      </div>
    </div>

      <ProductStrip title="Top Deals" items={topDeals} />
      <ProductStrip title="New Arrivals" items={newArrivals} />
      <ProductStrip title="Best Sellers" items={bestSellers} />
    </div>
  );
};

export default HomePage;
