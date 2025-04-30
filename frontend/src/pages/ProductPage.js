import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosInstance from "../utils/axiosInstance";
import ReactStars from "react-rating-stars-component";
import "../styles/product.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");
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

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  if (!product) return <p>Завантаження...</p>;

  return (
    <div className="product-container">
      <div className="product-main">
        <div className="product-image-page">
          <img src={`/images/${product.image_url}`} alt={product.name} />
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-page-price">{product.price} грн</p>

          {product.stock > 0 ? (
            <button onClick={() => addToCart(product)} className="add-to-cart-product-btn">
              Додати в кошик
            </button>
          ) : (
            <p className="product-out-of-stock">Немає в наявності</p>
          )}
        </div>
      </div>

      <div className="reviews">
        <div className="reviews-header">
          <h2>Відгуки</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="review-sort-select"
          >
            <option value="newest">Найновіші</option>
            <option value="highest">Найвищі оцінки</option>
            <option value="lowest">Найнижчі оцінки</option>
          </select>
        </div>

        {reviews.length > 0 ? (
          <ul>
            {sortedReviews.map((review) => (
              <li key={review.id} className="review-item">
                <div className="review-top-row">
                  <strong>{review.username}</strong>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={18}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                </div>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Немає відгуків</p>
        )}

        <div className="reviews">
          <h3 className="review-form-title">Додати відгук</h3>
          <form onSubmit={handleAddReview} className="review-form">
            <div className="form-columns">
              <div className="form-group left-column">
                <label className="form-label">Оцінка:</label>
                <ReactStars
                  count={5}
                  value={rating}
                  onChange={(newRating) => setRating(newRating)}
                  size={30}
                  isHalf={false}
                  activeColor="#fbbf24"
                />
              </div>
              <div className="form-group right-column">
                <label htmlFor="comment" className="form-label">Коментар:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Напишіть ваші враження..."
                  className="form-textarea"
                />
              </div>
            </div>
            <button type="submit" className="form-button">
              Залишити відгук
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
