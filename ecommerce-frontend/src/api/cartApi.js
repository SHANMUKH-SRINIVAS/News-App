import axiosClient from "./axiosClient";

const cartApi = {
  getCart: () => axiosClient.get("/cart"),
  addItem: (productId, quantity, price) =>
    axiosClient.post("/cart", { productId, quantity, price }),
  updateQuantity: (productId, quantity) =>
    axiosClient.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId) => axiosClient.delete(`/cart/${productId}`),
};

export default cartApi;

