import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosInstance from "../utils/axiosInstance";
import "../styles/product.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Помилка завантаження товару:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });

      setReviews([response.data, ...reviews]);
      setRating(0);
      setComment("");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        console.error("Помилка додавання відгуку:", error);
      }
    }
  };

  if (!product) return <p>Завантаження...</p>;

  return (
    <div className="product-container">
      <div className="product-main">
        <div className="product-image-page">
          <img
            src={`/images/${product.image_url}`}
            alt={product.name}
          />
        </div>
  
        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-page-price">{product.price} грн</p>
  
          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="add-to-cart-product-btn"
            >
              Додати в кошик
            </button>
          ) : (
            <p className="product-out-of-stock">Немає в наявності</p>
          )}
        </div>
      </div>
  
      {/* Відгуки */}
      <div className="reviews">
        <h2>Відгуки</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <p><strong>{review.username}</strong></p>
                <p>Оцінка: {review.rating}</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Немає відгуків</p>
        )}
  
        <h3>Додати відгук</h3>
        <form onSubmit={handleAddReview}>
          <div>
            <label>Оцінка:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Коментар:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button type="submit">Залишити відгук</button>
        </form>
      </div>
    </div>
  );
  
};

export default ProductPage;
