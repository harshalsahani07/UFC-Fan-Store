import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Navbar = () => {
  const { user, logout, cart, darkMode, toggleDark } = useApp();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
      <div className="container-app py-3 flex flex-wrap gap-3 justify-between items-center">
        <div className="font-extrabold tracking-wide">UFC Fan Store + Fighter Hub</div>
        <div className="flex gap-3 items-center text-sm">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/fighters">Fighters</Link>
        {user && <Link to="/cart">Cart ({cart.length})</Link>}
        {user && <Link to="/orders">Orders</Link>}
        {user && <Link to="/wishlist">Wishlist</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          <button onClick={toggleDark} className="px-2 py-1 bg-slate-700 rounded">
          {darkMode ? "Light" : "Dark"}
        </button>
        {user ? (
            <button onClick={logout} className="px-2 py-1 bg-red-600 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
