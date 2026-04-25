import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useApp } from "../context/AppContext";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [page, setPage] = useState(1);
  const { addToCart } = useApp();
  const pageSize = 12;

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products
    .filter(
      (p) =>
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())) &&
        (category === "all" || p.category === category) &&
        (priceRange === "all" ||
          (priceRange === "0-40" && p.price <= 40) ||
          (priceRange === "40-80" && p.price > 40 && p.price <= 80) ||
          (priceRange === "80+" && p.price > 80))
    )
    .sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      return (b.soldCount || 0) - (a.soldCount || 0);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, sort, category, priceRange]);

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <h2 className="text-3xl font-bold">UFC Store Products ({filtered.length})</h2>
        <div className="flex gap-2">
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-black"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-black"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Best Selling</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px,1fr] gap-4">
        <aside className="card-ecom p-4 h-fit">
          <h3 className="font-bold mb-3">Filters</h3>
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Category</p>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option value={c} key={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Price</p>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="0-40">Under $40</option>
              <option value="40-80">$40 - $80</option>
              <option value="80+">Above $80</option>
            </select>
          </div>
        </aside>

        <div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((p) => (
              <div key={p._id} className="card-ecom overflow-hidden">
                <img src={p.imageUrl} alt={p.name} className="h-48 w-full object-cover" />
                <div className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.category}</p>
                  <h3 className="font-semibold line-clamp-2 min-h-12">{p.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">{p.description}</p>
                  <p className="mb-2 font-bold text-lg">${p.price}</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg" onClick={() => addToCart(p)}>
                      Add to Cart
                    </button>
                    <Link className="px-3 py-1.5 bg-slate-200 text-slate-900 rounded-lg" to={`/products/${p._id}`}>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4 items-center">
            <button
              className="px-3 py-1.5 rounded bg-slate-200 text-slate-900 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <p className="text-sm">
              Page {page} / {totalPages}
            </p>
            <button
              className="px-3 py-1.5 rounded bg-slate-200 text-slate-900 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
