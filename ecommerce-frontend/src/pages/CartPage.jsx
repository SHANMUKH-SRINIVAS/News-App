import { useEffect, useState } from "react";
import cartApi from "../api/cartApi";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    await cartApi.removeItem(productId);
    await loadCart();
  };

  const total = items.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );

  return (
    <div>
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <div>Product ID: {item.productId}</div>
                  <div>Qty: {item.quantity}</div>
                  <div>Price: ${item.priceSnapshot}</div>
                </div>
                <button onClick={() => handleRemove(item.productId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
}

