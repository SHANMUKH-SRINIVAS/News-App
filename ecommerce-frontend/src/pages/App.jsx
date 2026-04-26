import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import LoginPage from "./LoginPage.jsx";
import CartPage from "./CartPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/products");
        setProducts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const token = localStorage.getItem("accessToken");

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">MyShop</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {token && (
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Products</h1>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="product-grid">
                    {products.map((p) => (
                      <div key={p.id} className="product-card">
                        <div className="product-image" />
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <strong>${p.price}</strong>
                        {token && (
                          <button
                            className="add-cart-button"
                            onClick={async () => {
                              try {
                                await import("../api/cartApi").then(
                                  ({ default: cartApi }) =>
                                    cartApi.addItem(p.id, 1, p.price)
                                );
                                alert("Added to cart");
                              } catch (e) {
                                console.error(e);
                                alert("Failed to add to cart");
                              }
                            }}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

